import { AlgorithmCalculateTime } from '@mono-calendar/contracts';
import { Injectable, Logger } from '@nestjs/common';
import { RMQService } from 'nestjs-rmq';
import { TypedConfigService } from '../common/typed-config/typed-config.service';
import validateAndTransform from '../common/validate-transform.function';

@Injectable()
export class AlgorithmService {
  private readonly logger: Logger = new Logger(AlgorithmService.name);

  constructor(
    private readonly rmqService: RMQService,
    private readonly configService: TypedConfigService,
  ) {}

  async calculateTime(
    payload: AlgorithmCalculateTime.Request,
  ): Promise<AlgorithmCalculateTime.Response | null> {
    try {
      const response = await this.rmqService.send<
        AlgorithmCalculateTime.Request,
        AlgorithmCalculateTime.Response
      >(AlgorithmCalculateTime.topic, payload, {
        timeout: this.configService.AlgorithmServiceTimeout,
      });
      const validResponse = await validateAndTransform(response, AlgorithmCalculateTime.Response);
      return validResponse;
    } catch (e) {
      if (e instanceof Error) {
        this.logger.error(e.message);
      }
      return null;
    }
  }
}
