import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TypedConfigService {
  constructor(private configService: ConfigService) {}

  get jwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET', 'test');
  }

  get databaseUrl(): string {
    const url = this.configService.get<string>('DATABASE_URL');
    if (!url) {
      throw new Error('В ваших конфиг файлах отсутствует переменная DATABASE_URL');
    }
    return url;
  }

  get redisHost(): string {
    return this.configService.get<string>('REDIS_HOST', 'localhost');
  }

  get redisPort(): number {
    const val = this.configService.get('REDIS_PORT', '6379');
    const num = Number(val);
    if (isNaN(num)) {
      throw new Error(`Invalid REDIS_PORT: ${val}`);
    }
    return num;
  }

  get redisCommonHost(): string {
    return this.configService.get<string>('REDIS_COMMON_HOST', 'localhost');
  }

  get redisCommonPort(): number {
    const val = this.configService.get('REDIS_COMMON_PORT', '6380');
    const num = Number(val);
    if (isNaN(num)) {
      throw new Error(`Invalid REDIS_COMMON_PORT: ${val}`);
    }
    return num;
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
    return this.configService.get<string>('AMQP_QUEUE', 'account');
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
    return this.configService.get<string>('SERVICE_NAME', 'tempus-account');
  }
}
