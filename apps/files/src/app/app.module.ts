import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StorageModule } from './common/storage/storage.module';
import { TypedConfigModule } from './common/typed-config/typed-config.module';
import { ConfigModule } from '@nestjs/config';
import { RMQModule } from 'nestjs-rmq';
import { getRMQConfig } from './config/rmq.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: 'envs/.files.env' }),
    TypedConfigModule,
    StorageModule,
    RMQModule.forRootAsync(getRMQConfig()),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
