import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TypedConfigService {
  constructor(private readonly configService: ConfigService) {}

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
    return this.configService.get<string>('AMQP_QUEUE', 'notification');
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
    return this.configService.get<string>('SERVICE_NAME', 'tempus-notification');
  }

  get mailUser(): string {
    const user = this.configService.get<string>('MAIL_USER');
    if (!user) {
      throw new Error('В ваших конфиг файлах отсутствует переменная окружения MAIL_USER');
    }
    return user;
  }

  get mailPassword(): string {
    const password = this.configService.get<string>('MAIL_PASSWORD');
    if (!password) {
      throw new Error('В ваших конфиг файлах отсутствует переменная окружения MAIL_PASSWORD');
    }
    return password;
  }

  get mailHost(): string {
    return this.configService.get<string>('MAIL_HOST', 'smtp.google.com');
  }

  get mailPort(): number {
    const val = this.configService.get('MAIL_PORT', '465');
    const num = Number(val);
    if (isNaN(num)) {
      throw new Error(`Invalid MAIL_PORT: ${val}`);
    }
    return num;
  }

  get frontendUrl(): string {
    const front = this.configService.get<string>('FRONTEND_URL');
    if (!front) {
      throw new Error('В ваших конфиг файлах отсутствует переменная окружения FRONTEND_URL');
    }
    return front;
  }
}
