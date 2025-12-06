import { Global, Module } from '@nestjs/common';
import { RedisCommonService } from './redis-common.service';

@Module({
  providers: [RedisCommonService],
  exports: [RedisCommonService],
})
export class RedisCommonModule {}
