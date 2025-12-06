import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { TypedConfigService } from '../common/typed-config/typed-config.service';

@Injectable()
export class EmailService {
  private readonly logger: Logger = new Logger(EmailService.name);
  constructor(
    private readonly configService: TypedConfigService,
    private readonly mailerService: MailerService,
  ) {}

  async sendEmailConfirmation(email: string, token: string): Promise<void> {
    const confirmLink = `${this.configService.frontendUrl}/auth/confirm-email?token=${token}`;
    const res = await this.mailerService.sendMail({
      to: email,
      subject: 'Подтвердите ваш email',
      html: `
      <p>Пожалуйста, подтвердите ваш email, перейдя по ссылке:</p>
      <a href="${confirmLink}">Подтвердить</a>
      <p>Ссылка действительна 2 часа.</p>
    `,
    });
  }
}
