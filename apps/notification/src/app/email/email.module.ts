import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailController } from './email.controller';

@Module({
  imports: [MailerModule],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
