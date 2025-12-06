import { Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import {
  ALREADY_REGISTERED_ERROR,
  EMAIL_CONFIRM_TOKEN_INVALID_ERROR,
  REFRESH_TOKEN_INVALID_ERROR,
  USER_EMAIL_NOT_VERIFIED_ERROR,
  USER_NOT_FOUND_ERROR,
  WRONG_PASSWORD_ERROR,
} from './auth.constans';
import { randomBytes, createHash, timingSafeEqual } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import {
  AccountLogin,
  AccountLoginUseToken,
  AccountRegister,
  NotificationUserRegistered,
} from '@mono-calendar/contracts';
import { ERROR_TYPE } from 'nestjs-rmq/dist/constants';
import { RMQError, RMQService } from 'nestjs-rmq';
import { UserEntity } from '../user/entities/user.entity';
import { UserRepository } from '../user/user.repository';
import { IJwtPayload, IRefreshTokenPayload } from '@mono-calendar/interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly rmqService: RMQService,
  ) {}

  async register(dto: AccountRegister.Request): Promise<AccountRegister.Response> {
    const oldUser = await this.userRepository.findUserByEmail(dto.email);
    if (oldUser) {
      throw new RMQError(ALREADY_REGISTERED_ERROR, ERROR_TYPE.RMQ);
    }
    const userEntity = await UserEntity.createFromDto(dto);
    const user = await this.userRepository.create(userEntity);
    const createdUser = new UserEntity(user);

    const token = this.generateEmailConfirmationToken();
    await this.authRepository.storeEmailToken(createdUser.id, token);
    await this.rmqService.notify<NotificationUserRegistered.Request>(
      NotificationUserRegistered.topic,
      {
        email: createdUser.email,
        confirmEmailToken: token,
      },
    );
    return {};
  }

  async login(email: string, password: string, sign: string): Promise<AccountLogin.Response> {
    const lifetime = 30 * 24 * 60 * 60;
    const { userId } = await this.validate(email, password);
    const payload: IJwtPayload = {
      sub: userId,
      email,
      exp: Math.floor(Date.now() / 1000) + 2 * 60 * 60,
      iat: Math.floor(Date.now() / 1000),
    };
    const refreshToken = this.generateRefreshToken();
    await this.setRefreshToken(userId, refreshToken, sign, lifetime);
    return {
      accessToken: await this.jwtService.signAsync(payload),
      expiresIn: Math.floor(Date.now() / 1000) + 2 * 60 * 60,

      refreshToken,
      maxAge: lifetime,
    };
  }

  async validate(email: string, password: string): Promise<{ userId: string }> {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new RMQError(USER_NOT_FOUND_ERROR, ERROR_TYPE.RMQ);
    }
    const userEntity = new UserEntity(user);
    if (!(await userEntity.isCorrectPassword(password))) {
      throw new RMQError(WRONG_PASSWORD_ERROR, ERROR_TYPE.RMQ);
    }
    if (!userEntity.isEmailVerified) {
      throw new RMQError(USER_EMAIL_NOT_VERIFIED_ERROR, ERROR_TYPE.RMQ);
    }
    return { userId: userEntity.id };
  }

  async confirmEmail(token: string): Promise<void> {
    const userId = await this.authRepository.extractUserId(token);
    if (!userId) {
      throw new RMQError(EMAIL_CONFIRM_TOKEN_INVALID_ERROR, ERROR_TYPE.RMQ);
    }
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new RMQError(USER_NOT_FOUND_ERROR, ERROR_TYPE.RMQ);
    }
    const userEntity = new UserEntity(user);
    userEntity.isEmailVerified = true;
    await this.userRepository.update(userEntity);
    await this.authRepository.deleteConfirmEmailToken(token);
  }

  generateEmailConfirmationToken(): string {
    return randomBytes(32).toString('hex');
  }

  generateRefreshToken(): string {
    return randomBytes(32).toString('hex');
  }

  async setRefreshToken(
    userId: string,
    token: string,
    sign: string,
    lifetime: number,
  ): Promise<void> {
    const deviceFingerprint = createHash('sha256').update(sign).digest('hex');
    const data: IRefreshTokenPayload = {
      userId,
      iat: Math.floor(Date.now() / 1000),
      deviceFingerprint,
    };
    await this.authRepository.setRefreshToken(userId, token, data, lifetime);
  }

  async loginUseToken(token: string, sign: string): Promise<AccountLoginUseToken.Response> {
    const oldRefreshToken = await this.authRepository.getRefreshToken(token);
    if (!oldRefreshToken) {
      throw new RMQError(REFRESH_TOKEN_INVALID_ERROR, ERROR_TYPE.RMQ);
    }
    const refreshData: IRefreshTokenPayload = JSON.parse(oldRefreshToken);
    if (!this.verifySafeSighRefreshToken(sign, refreshData.deviceFingerprint)) {
      throw new RMQError(REFRESH_TOKEN_INVALID_ERROR, ERROR_TYPE.RMQ);
    }
    const user = await this.userRepository.findUserById(refreshData.userId);
    if (!user) {
      throw new RMQError(USER_NOT_FOUND_ERROR, ERROR_TYPE.RMQ);
    }
    const lifetime = 30 * 24 * 60 * 60;
    const payload: IJwtPayload = {
      sub: user.id,
      email: user.email,
      exp: Math.floor(Date.now() / 1000) + 2 * 60 * 60,
      iat: Math.floor(Date.now() / 1000),
    };
    const refreshToken = this.generateRefreshToken();
    await this.setRefreshToken(user.id, refreshToken, sign, lifetime);
    await this.authRepository.delRefreshToken(token);
    return {
      accessToken: await this.jwtService.signAsync(payload),
      expiresIn: Math.floor(Date.now() / 1000) + 2 * 60 * 60,

      refreshToken,
      maxAge: lifetime,
    };
  }

  verifySafeSighRefreshToken(value: string, storedHash: string): boolean {
    const hash = createHash('sha256').update(value).digest();
    const storedBuffer = Buffer.from(storedHash, 'hex');

    if (hash.length !== storedBuffer.length) return false;

    return timingSafeEqual(hash, storedBuffer);
  }

  async exit(accessToken: string, refreshToken?: string): Promise<void> {
    if (refreshToken) {
      await this.authRepository.delRefreshToken(refreshToken);
    }
    await this.authRepository.updateBlockList(accessToken);
  }

  async logoutUser(userId: string): Promise<void> {
    await this.authRepository.storeUserId(userId, 2 * 60 * 60);
    await this.authRepository.delAllUserRefreshTokens(userId);
  }

  async delUser(userId: string, accessToken: string): Promise<void> {
    await this.exit(accessToken);
    await this.logoutUser(userId);
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new RMQError(USER_NOT_FOUND_ERROR, ERROR_TYPE.RMQ);
    }
    const userEntity = new UserEntity(user);
    await this.userRepository.delete(userEntity);
  }
}
