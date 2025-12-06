import { Module } from '@nestjs/common';
import { AccountController } from './controllers/account.controller';
import { CalendarController } from './controllers/calendar.controller';
import { RMQModule } from 'nestjs-rmq';
import { ConfigModule } from '@nestjs/config';
import { getRMQConfig } from './config/rmq.config';
import { AccountService } from './services/account.service';
import { CalendarService } from './services/calendar.service';
import { StorageModule } from './common/storage/storage.module';
import { FilesService } from './services/files.service';
import { FilesController } from './controllers/files.controller';
import { HttpModule } from '@nestjs/axios';
import { TypedConfigModule } from './common/typed-config/typed-config.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RedisCommonModule } from './common/redis/redis-common.module';

@Module({
  imports: [
    RMQModule.forRootAsync(getRMQConfig()),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: 'envs/.main.env' }),
    TypedConfigModule,
    StorageModule,
    HttpModule.register({
      timeout: 1000,
      maxRedirects: 5,
    }),
    RedisCommonModule,
  ],
  controllers: [AccountController, CalendarController, FilesController],
  providers: [AccountService, CalendarService, FilesService, JwtStrategy],
})
export class AppModule {}
