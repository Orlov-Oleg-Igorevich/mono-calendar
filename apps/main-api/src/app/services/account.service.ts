import { RegisterDto, ConfirmEmailDto, ChangeProfileDto } from '@mono-calendar/dto';
import {
  AccountLogin,
  AccountRegister,
  AccountConfirmEmail,
  AccountLoginUseToken,
  AccountChangeProfile,
  AccountDeleteUser,
  AccountExit,
  AccountGetProfile,
  AccountLogout,
  AccountGetMailMatches,
} from '@mono-calendar/contracts';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RMQError, RMQService } from 'nestjs-rmq';

@Injectable()
export class AccountService {
  constructor(private readonly rmqService: RMQService) {}

  async registerUser(dto: RegisterDto.Request): Promise<AccountRegister.Response> {
    try {
      return await this.rmqService.send<AccountRegister.Request, AccountRegister.Response>(
        AccountRegister.topic,
        dto,
      );
    } catch (e) {
      if (e instanceof RMQError) {
        throw new BadRequestException(e.message);
      }
      throw new BadRequestException('Непредвиденная ошибка. Повторите запрос');
    }
  }

  async loginUser(dto: AccountLogin.Request): Promise<AccountLogin.Response> {
    try {
      return await this.rmqService.send<AccountLogin.Request, AccountLogin.Response>(
        AccountLogin.topic,
        dto,
      );
    } catch (e) {
      if (e instanceof RMQError) {
        throw new UnauthorizedException(e.message);
      }
      throw new BadRequestException('Непредвиденная ошибка. Повторите запрос');
    }
  }

  async confirmUserEmail(dto: ConfirmEmailDto.Request): Promise<AccountConfirmEmail.Response> {
    try {
      return await this.rmqService.send<AccountConfirmEmail.Request, AccountConfirmEmail.Response>(
        AccountConfirmEmail.topic,
        dto,
      );
    } catch (e) {
      if (e instanceof RMQError) {
        throw new BadRequestException(e.message);
      }
      throw new BadRequestException('Непредвиденная ошибка. Повторите запрос');
    }
  }

  async loginUseToken(dto: AccountLoginUseToken.Request): Promise<AccountLoginUseToken.Response> {
    try {
      return await this.rmqService.send<
        AccountLoginUseToken.Request,
        AccountLoginUseToken.Response
      >(AccountLoginUseToken.topic, dto);
    } catch (e) {
      if (e instanceof RMQError) {
        throw new UnauthorizedException(e.message);
      }
      throw new BadRequestException('Непредвиденная ошибка. Повторите запрос');
    }
  }

  async changeUser(
    userId: string,
    dto: ChangeProfileDto.Request,
  ): Promise<AccountChangeProfile.Response> {
    try {
      return await this.rmqService.send<
        AccountChangeProfile.Request,
        AccountChangeProfile.Response
      >(AccountChangeProfile.topic, { userId, name: dto.name });
    } catch (e) {
      if (e instanceof RMQError) {
        throw new BadRequestException(e.message);
      }
      throw new BadRequestException('Непредвиденная ошибка. Повторите запрос');
    }
  }

  async deleteUser(userId: string, accessToken: string): Promise<AccountDeleteUser.Response> {
    try {
      return await this.rmqService.send<AccountDeleteUser.Request, AccountDeleteUser.Response>(
        AccountDeleteUser.topic,
        { userId, accessToken },
      );
    } catch (e) {
      if (e instanceof RMQError) {
        throw new BadRequestException(e.message);
      }
      throw new BadRequestException('Непредвиденная ошибка. Повторите запрос');
    }
  }

  async exitUserAccount(
    userId: string,
    accessToken: string,
    refreshToken?: string,
  ): Promise<AccountExit.Response> {
    try {
      return await this.rmqService.send<AccountExit.Request, AccountExit.Response>(
        AccountExit.topic,
        { userId, accessToken, refreshToken },
      );
    } catch (e) {
      if (e instanceof RMQError) {
        throw new BadRequestException(e.message);
      }
      throw new BadRequestException('Непредвиденная ошибка. Повторите запрос');
    }
  }

  async logoutUser(userId: string, accessToken: string): Promise<AccountLogout.Response> {
    try {
      return await this.rmqService.send<AccountLogout.Request, AccountLogout.Response>(
        AccountLogout.topic,
        { userId, accessToken },
      );
    } catch (e) {
      if (e instanceof RMQError) {
        throw new BadRequestException(e.message);
      }
      throw new BadRequestException('Непредвиденная ошибка. Повторите запрос');
    }
  }

  async getProfile(userId: string): Promise<AccountGetProfile.Response> {
    try {
      return await this.rmqService.send<AccountGetProfile.Request, AccountGetProfile.Response>(
        AccountGetProfile.topic,
        { userId },
      );
    } catch (e) {
      if (e instanceof RMQError) {
        throw new BadRequestException(e.message);
      }
      throw new BadRequestException('Непредвиденная ошибка. Повторите запрос');
    }
  }

  async getMailMatches(emailPrefix: string): Promise<AccountGetMailMatches.Response> {
    try {
      return await this.rmqService.send<
        AccountGetMailMatches.Request,
        AccountGetMailMatches.Response
      >(AccountGetMailMatches.topic, { emailPrefix });
    } catch (e) {
      if (e instanceof RMQError) {
        throw new BadRequestException(e.message);
      }
      throw new BadRequestException('Непредвиденная ошибка. Повторите запрос');
    }
  }
}
