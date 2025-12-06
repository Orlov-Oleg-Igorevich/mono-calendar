import { Controller, Body, Logger } from '@nestjs/common';
import { EmailService } from './email.service';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { NotificationUserRegistered } from '@mono-calendar/contracts';

@Controller()
export class EmailController {
  private readonly logger: Logger = new Logger(EmailController.name);
  constructor(private readonly emailService: EmailService) {}

  @RMQRoute(NotificationUserRegistered.topic)
  @RMQValidate()
  async sendConfirmEmailLink(
    @Body() { email, confirmEmailToken }: NotificationUserRegistered.Request,
  ): Promise<NotificationUserRegistered.Response> {
    this.logger.log('Сообщение пришло в контроллер sendConfirmEmailLink сервиса notification');
    await this.emailService.sendEmailConfirmation(email, confirmEmailToken);
    return {};
  }
}
