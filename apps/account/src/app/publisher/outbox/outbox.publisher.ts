import {
  CreateTaskEvent,
  ChangeTaskEvent,
  DeleteTaskEvent,
  ChangeCategoryEvent,
  DeleteCategoryEvent,
} from '@mono-calendar/contracts';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RMQService } from 'nestjs-rmq';
import { TypedConfigService } from '../../common/typed-config/typed-config.service';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OutboxPublisher {
  private readonly logger = new Logger(OutboxPublisher.name);
  private isPublishing = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly rmqService: RMQService,
    private readonly configService: TypedConfigService,
  ) {}

  // Запускать каждые 5 секунд
  @Cron(CronExpression.EVERY_5_SECONDS)
  async publishOutboxEvents(): Promise<void> {
    if (this.isPublishing) return;
    this.isPublishing = true;

    try {
      let hasMore = true;
      const batchSize = 50;

      while (hasMore) {
        const events = await this.prisma.getClient().outboxEvent.findMany({
          where: { processed: false },
          take: batchSize,
          orderBy: { createdAt: 'asc' },
        });

        if (events.length === 0) {
          hasMore = false;
          continue;
        }

        await Promise.all(
          events.map(async (event) => {
            try {
              await this.rmqService.notify(event.topic, event.payload);
              await this.markAsProcessed(event.id);
            } catch (error) {
              this.logger.error(`Failed to publish event ${event.id} (${event.topic})`);
            }
          }),
        );

        if (events.length < batchSize) hasMore = false;
      }
    } finally {
      this.isPublishing = false;
    }
  }

  private getRoutingKey(eventType: string): string | null {
    const mapping: Record<string, string> = {
      TaskCreated: CreateTaskEvent.topic,
      TaskUpdated: ChangeTaskEvent.topic,
      TaskDeleted: DeleteTaskEvent.topic,
      CategoryUpdated: ChangeCategoryEvent.topic,
      CategoryDeleted: DeleteCategoryEvent.topic,
    };
    return mapping[eventType] || null;
  }

  private async markAsProcessed(eventId: string): Promise<void> {
    await this.prisma.getClient().outboxEvent.update({
      where: { id: eventId },
      data: { processed: true },
    });
  }
}
