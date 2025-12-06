import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypedConfigModule } from '../common/typed-config/typed-config.module';
import { TypedConfigService } from '../common/typed-config/typed-config.service';
import { getJWTconfig } from '../config/jwt.config';
import { UserModule } from '../user/user.module';
import { RedisModule } from '../redis/redis.module';
import { RedisCommonModule } from '../common/common-redis/redis-common.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [TypedConfigModule],
      inject: [TypedConfigService],
      useFactory: getJWTconfig,
    }),
    UserModule,
    RedisModule,
    RedisCommonModule,
  ],
  providers: [AuthService, AuthRepository],
  controllers: [AuthController],
})
export class AuthModule {}
