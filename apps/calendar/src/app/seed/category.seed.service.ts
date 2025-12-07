// category.seed.service.ts
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SYSTEM_CATEGORIES } from './system-categories';
import { PrismaClientKnownRequestError } from '../prisma/generated/prisma/internal/prismaNamespace';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategorySeedService implements OnModuleInit {
  private readonly logger: Logger = new Logger(CategorySeedService.name);
  constructor(private readonly prismaService: PrismaService) {}

  async onModuleInit(): Promise<void> {
    await this.seedSystemCategories();
  }

  private async seedSystemCategories(): Promise<void> {
    this.logger.log('Seeding system categories...');

    for (const { name } of SYSTEM_CATEGORIES) {
      try {
        await this.prismaService.getClient().category.create({
          data: {
            name,
            isSystem: true,
            userId: null,
          },
        });
        this.logger.log(`✅ Создаём системную категорию: ${name}`);
      } catch (error) {
        // Если ошибка уникальности — игнорируем
        if (
          error instanceof PrismaClientKnownRequestError &&
          error.code === 'P2002' // Ошибка уникальности
        ) {
          console.log(`⏭️  Системная категория уже используется: ${name}`);
          continue;
        }
        // Любая другая ошибка — пробрасываем
        throw error;
      }
    }

    this.logger.log('✅ Заполнение системных категорий завершено.');
  }
}
