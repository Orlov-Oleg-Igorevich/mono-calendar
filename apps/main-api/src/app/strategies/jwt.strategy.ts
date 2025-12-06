import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJwtPayload } from '@mono-calendar/interface';

import { type Request } from 'express';
import { TypedConfigService } from '../common/typed-config/typed-config.service';
import { RedisCommonService } from '../common/redis/redis-common.service';
import {
  TOKEN_BLOCKLIST_ERROR,
  TOKEN_UNCORRECTED_VERSION_ERROR,
} from '../constans/authentication.constans';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: TypedConfigService,
    private readonly redisCommonService: RedisCommonService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.jwtSecret,
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    payload: IJwtPayload,
  ): Promise<{ id: string; email: string; token: string }> {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

    const isBlocked = await this.redisCommonService.get(`jwt:${token}`);
    if (!token || isBlocked) {
      throw new UnauthorizedException(TOKEN_BLOCKLIST_ERROR);
    }

    const resetTime = await this.redisCommonService.get(`userId:${payload.sub}`);
    if (resetTime && Number.parseInt(resetTime) > payload.iat) {
      throw new UnauthorizedException(TOKEN_UNCORRECTED_VERSION_ERROR);
    }

    return { email: payload.email, id: payload.sub, token };
  }
}
