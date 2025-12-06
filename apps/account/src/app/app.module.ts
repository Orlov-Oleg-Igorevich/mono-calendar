import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RedisModule } from './redis/redis.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { TypedConfigModule } from './common/typed-config/typed-config.module';
import { RedisCommonModule } from './common/common-redis/redis-common.module';
import { RMQModule } from 'nestjs-rmq';
import { getRMQConfig } from './config/rmq.config';
import { SharedContextModule } from '@mono-calendar/shared';
import { PublisherModule } from './publisher/publisher.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    AuthModule,
    UserModule,
    RedisModule,
    PrismaModule,
    RedisCommonModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'envs/.account.env',
    }),
    TypedConfigModule,
    RMQModule.forRootAsync(getRMQConfig()),
    SharedContextModule,
    PublisherModule,
  ],
})
export class AppModule {}
