import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RMQModule } from 'nestjs-rmq';
import { getRMQConfig } from './config/rmq.config';
import { TypedConfigModule } from './common/typed-config/typed-config.module';
import { EmailModule } from './email/email.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { TypedConfigService } from './common/typed-config/typed-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: 'envs/.notification.env' }),
    TypedConfigModule,
    RMQModule.forRootAsync(getRMQConfig()),
    EmailModule,
    MailerModule.forRootAsync({
      useFactory: async (config: TypedConfigService) => ({
        transport: {
          host: config.mailHost,
          port: config.mailPort,
          auth: {
            user: config.mailUser,
            pass: config.mailPassword,
          },
        },
        defaults: {
          from: `"Tempus" <${config.mailUser}>`,
        },
      }),
      inject: [TypedConfigService],
    }),
  ],
})
export class AppModule {}
