import { Module } from '@nestjs/common';
import { RMQModule } from 'nestjs-rmq';
import { getRMQConfig } from './config/rmq.config';
import { ConfigModule } from '@nestjs/config';
import { TypedConfigModule } from './common/typed-config/typed-config.module';
import { TaskModule } from './task/task.module';
import { PrismaModule } from './prisma/prisma.module';
import { CategoryModule } from './category/category.module';
import { SharedContextModule } from '@mono-calendar/shared';
import { ScheduleModule } from '@nestjs/schedule';
import { PublisherModule } from './publisher/publisher.module';
import { MLModule } from './ML-client/ml.module';
import { AlgorithmModule } from './algorithm-client/algorithm.module';
import { AccountClientModule } from './account-client/account-client.module';
import { CategorySeedService } from './seed/category.seed.service';

@Module({
  imports: [
    RMQModule.forRootAsync(getRMQConfig()),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: 'envs/.calendar.env' }),
    TypedConfigModule,
    TaskModule,
    CategoryModule,
    PrismaModule,
    SharedContextModule,
    ScheduleModule.forRoot(),
    PublisherModule,
    MLModule,
    AlgorithmModule,
    AccountClientModule,
  ],
  providers: [CategorySeedService],
})
export class AppModule {}
