import { Body, Controller, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import {
  AccountConfirmEmail,
  AccountDeleteUser,
  AccountExit,
  AccountLogin,
  AccountLoginUseToken,
  AccountLogout,
  AccountRegister,
} from '@mono-calendar/contracts';

@Controller()
export class AuthController {
  private readonly logger: Logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @RMQValidate()
  @RMQRoute(AccountRegister.topic)
  async register(@Body() payload: AccountRegister.Request): Promise<AccountRegister.Response> {
    this.logger.log('Сообщение пришло в контроллер register сервиса account');
    return this.authService.register(payload);
  }

  @RMQValidate()
  @RMQRoute(AccountLogin.topic)
  async login(
    @Body() { email, password, userAgent }: AccountLogin.Request,
  ): Promise<AccountLogin.Response> {
    this.logger.log('Сообщение пришло в контроллер login сервиса account');
    return this.authService.login(email, password, userAgent);
  }

  @RMQValidate()
  @RMQRoute(AccountConfirmEmail.topic)
  async confirmEmail(
    @Body() { token }: AccountConfirmEmail.Request,
  ): Promise<AccountConfirmEmail.Response> {
    this.logger.log('Сообщение пришло в контроллер confirmEmail сервиса account');
    await this.authService.confirmEmail(token);
    return {};
  }

  @RMQValidate()
  @RMQRoute(AccountLoginUseToken.topic)
  async loginUseToken(
    @Body() { token, sign }: AccountLoginUseToken.Request,
  ): Promise<AccountLoginUseToken.Response> {
    this.logger.log('Сообщение пришло в контроллер loginUseToken сервиса account');
    return this.authService.loginUseToken(token, sign);
  }

  @RMQValidate()
  @RMQRoute(AccountExit.topic)
  async exit(
    @Body() { accessToken, refreshToken }: AccountExit.Request,
  ): Promise<AccountExit.Response> {
    this.logger.log('Сообщение пришло в контроллер exit сервиса account');
    await this.authService.exit(accessToken, refreshToken);
    return {};
  }

  @RMQValidate()
  @RMQRoute(AccountLogout.topic)
  async logout(
    @Body() { userId, accessToken }: AccountLogout.Request,
  ): Promise<AccountLogout.Response> {
    this.logger.log('Сообщение пришло в контроллер logout сервиса account');
    await this.authService.exit(accessToken);
    await this.authService.logoutUser(userId);
    return {};
  }

  @RMQValidate()
  @RMQRoute(AccountDeleteUser.topic)
  async delUser(
    @Body() { userId, accessToken }: AccountDeleteUser.Request,
  ): Promise<AccountDeleteUser.Response> {
    this.logger.log('Сообщение пришло в контроллер delUser сервиса account');
    await this.authService.delUser(userId, accessToken);
    return {};
  }
}
