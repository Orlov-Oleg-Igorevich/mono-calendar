import { Injectable } from '@nestjs/common';
import { RedisCommonService } from '../common/common-redis/redis-common.service';
import { RedisService } from '../redis/redis.service';
import { IRefreshTokenPayload } from '@mono-calendar/interface';

@Injectable()
export class AuthRepository {
  constructor(
    private readonly redisService: RedisService,
    private readonly redisCommonService: RedisCommonService,
  ) {}

  async setRefreshToken(
    userId: string,
    token: string,
    data: IRefreshTokenPayload,
    lifetime: number,
  ): Promise<string> {
    return this.redisService.set(`refresh:${userId}:${token}`, JSON.stringify(data), lifetime);
  }

  async delRefreshToken(token: string): Promise<number> {
    return this.redisService.deleteByPattern(`refresh:*:${token}`);
  }

  async getRefreshToken(token: string): Promise<string | null> {
    const values = await this.redisService.getByPattern(`refresh:*:${token}`);
    if (values[0]) {
      return values[0];
    }
    return null;
  }

  async delAllUserRefreshTokens(userId: string): Promise<number> {
    return this.redisService.deleteByPattern(`refresh:${userId}:*`);
  }

  async updateBlockList(token: string): Promise<void> {
    this.redisCommonService.set(`jwt:${token}`, '1', 1 * 24 * 60 * 60);
  }

  async storeEmailToken(userId: string, token: string): Promise<void> {
    this.redisService.set(`email-confirm:${token}`, userId, 2 * 60 * 60);
  }

  async extractUserId(emailConfirmToken: string): Promise<string | null> {
    return this.redisService.get(`email-confirm:${emailConfirmToken}`);
  }

  async deleteConfirmEmailToken(token: string): Promise<number> {
    return this.redisService.del(`email-confirm:${token}`);
  }

  async storeUserId(userId: string, duration: number): Promise<string> {
    return this.redisCommonService.set(
      `userId:${userId}`,
      Math.floor(Date.now() / 1000).toString(),
      duration,
    );
  }
}
