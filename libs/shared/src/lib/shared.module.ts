import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RequestContextMiddleware } from './middleware/request-context.middleware';

@Module({})
export class SharedContextModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestContextMiddleware).forRoutes('*');
  }
}
