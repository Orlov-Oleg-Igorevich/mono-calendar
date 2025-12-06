import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TypedConfigService {
  constructor(private configService: ConfigService) {}

  get databaseUrl(): string {
    const url = this.configService.get<string>('DATABASE_URL')!;
    if (!url) {
      throw new Error('В ваших конфиг файлах отсутствует переменная DATABASE_URL');
    }
    return url;
  }

  get exchangeRMQName(): string {
    return this.configService.get<string>('AMQP_EXCHANGE', 'tempus');
  }

  get loginRMQ(): string {
    return this.configService.get<string>('AMQP_LOGIN', 'guest');
  }

  get passwordRMQ(): string {
    return this.configService.get<string>('AMQP_PASSWORD', 'guest');
  }

  get hostRMQ(): string {
    return this.configService.get<string>('AMQP_HOSTNAME', 'localhost');
  }

  get portRMQ(): number {
    const val = this.configService.get('AMQP_PORT', '5672');
    const num = Number(val);
    if (isNaN(num)) {
      throw new Error(`Invalid AMQP_PORT: ${val}`);
    }
    return num;
  }

  get queueRMQName(): string {
    return this.configService.get<string>('AMQP_QUEUE', 'calendar');
  }

  get prefetchRMQCount(): number {
    const val = this.configService.get('AMQP_PREFETCH_COUNT', '32');
    const num = Number(val);
    if (isNaN(num)) {
      throw new Error(`Invalid AMQP_PREFETCH_COUNT: ${val}`);
    }
    return num;
  }

  get serviceName(): string {
    return this.configService.get<string>('SERVICE_NAME', 'tempus-calendar');
  }

  get MLServiceTimeout(): number {
    const val = this.configService.get('ML_SERVICE_TIMEOUT', '500');
    const num = Number(val);
    if (isNaN(num)) {
      throw new Error(`Invalid ML_SERVICE_TIMEOUT: ${val}`);
    }
    return num;
  }

  get AlgorithmServiceTimeout(): number {
    const val = this.configService.get('ALGORITHM_SERVICE_TIMEOUT', '500');
    const num = Number(val);
    if (isNaN(num)) {
      throw new Error(`Invalid ALGORITHM_SERVICE_TIMEOUT: ${val}`);
    }
    return num;
  }

  get accountServiceUrl(): string {
    return this.configService.get<string>('ACCOUNT_SERVICE_URL', 'http://localhost:3004');
  }

  get accountServiceTimeout(): number {
    const val = this.configService.get('ACCOUNT_SERVICE_TIMEOUT', '1500');
    const num = Number(val);
    if (isNaN(num)) {
      throw new Error(`Invalid ACCOUNT_SERVICE_TIMEOUT: ${val}`);
    }
    return num;
  }
}
