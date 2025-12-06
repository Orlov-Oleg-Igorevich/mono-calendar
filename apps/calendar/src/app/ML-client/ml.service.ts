import { MLCalculateCategories, MLCalculateTime } from '@mono-calendar/contracts';
import { Injectable, Logger } from '@nestjs/common';
import { RMQService } from 'nestjs-rmq';
import { TypedConfigService } from '../common/typed-config/typed-config.service';

@Injectable()
export class MLService {
  private readonly logger: Logger = new Logger(MLService.name);

  constructor(
    private readonly rmqService: RMQService,
    private readonly configService: TypedConfigService,
  ) {}

  async calculateTime(userInput: string, categories: string[]): Promise<MLCalculateTime.Response> {
    try {
      return await this.rmqService.send<MLCalculateTime.Request, MLCalculateTime.Response>(
        MLCalculateTime.topic,
        { userInput, categories },
        { timeout: this.configService.MLServiceTimeout },
      );
    } catch (e) {
      if (e instanceof Error) {
        this.logger.error(e.message);
      }
      return { timeInMinutes: 120 };
    }
  }

  async calculateCategories(userInput: string): Promise<MLCalculateCategories.Response> {
    try {
      return await this.rmqService.send<
        MLCalculateCategories.Request,
        MLCalculateCategories.Response
      >(
        MLCalculateCategories.topic,
        { userInput },
        { timeout: this.configService.MLServiceTimeout },
      );
    } catch (e) {
      if (e instanceof Error) {
        this.logger.error(e.message);
      }
      return { onTheStreet: false, categories: ['Прочее'] };
    }
  }
}
