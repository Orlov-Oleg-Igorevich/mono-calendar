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
    return this.configService.get<string>('AMQP_QUEUE', 'api-gateway');
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
    return this.configService.get<string>('SERVICE_NAME', 'tempus-gateway');
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

  get jwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET', 'tempus');
  }

  get storageEndpoint(): string {
    return this.configService.get<string>('MINIO_ENDPOINT', 'http://localhost:9000');
  }

  get storageRegion(): string {
    return this.configService.get<string>('STORAGE_REGION', 'us-east-1');
  }

  get storageAccessKeyId(): string {
    return this.configService.get<string>('MINIO_ACCESS_KEY', 'minioadmin');
  }

  get storageSecretAccessKey(): string {
    return this.configService.get<string>('MINIO_SECRET_KEY', 'minioadmin');
  }

  get storageBucket(): string {
    return this.configService.get<string>('MINIO_BUCKET', 'app-files');
  }

  get storagePublicUrlBase(): string {
    return this.configService.get<string>('MINIO_PUBLIC_URL', 'http://localhost:9000/app-files');
  }

  get calendarServiceUrl(): string {
    return this.configService.get<string>('CALENDAR_SERVICE_URL', 'http://localhost:3005');
  }

  get calendarServiceTimeout(): number {
    const val = this.configService.get('CALENDAR_SERVICE_TIMEOUT', '5000');
    const num = Number(val);
    if (isNaN(num)) {
      throw new Error(`Invalid CALENDAR_SERVICE_TIMEOUT: ${val}`);
    }
    return num;
  }
}
