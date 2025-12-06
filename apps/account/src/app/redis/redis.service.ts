import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { TypedConfigService } from '../common/typed-config/typed-config.service';
import { string } from 'zod';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly client: Redis;

  constructor(private readonly configService: TypedConfigService) {
    const host = configService.redisHost;
    const port = configService.redisPort;
    this.client = new Redis({
      host,
      port,
    });
  }

  getClient(): Redis {
    return this.client;
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.quit();
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<string> {
    if (ttlSeconds) {
      return this.client.set(key, value, 'EX', ttlSeconds);
    }
    return this.client.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async del(key: string): Promise<number> {
    return this.client.del(key);
  }

  async *scanKeys(match: string, count = 100): AsyncGenerator<string> {
    const stream = this.client.scanStream({ match, count });
    for await (const keys of stream) {
      for (const key of keys) {
        yield key;
      }
    }
  }

  async getByPattern(pattern: string): Promise<string[]> {
    const res: string[] = [];
    let pipeline = this.client.pipeline();
    let count = 0;

    for await (const key of this.scanKeys(pattern)) {
      pipeline.get(key);
      count += 1;

      if (count % 1000 === 0) {
        const part = await pipeline.exec();
        if (part) {
          for (const [error, value] of part) {
            // if (error instanceof Error) {}
            if (typeof value === 'string') res.push(value);
          }
        }
        pipeline = this.client.pipeline();
      }
    }

    if (count % 1000 !== 0) {
      const part = await pipeline.exec();
      if (part) {
        for (const [error, value] of part) {
          // if (error instanceof Error) {}
          if (typeof value === 'string') res.push(value);
        }
      }
    }

    return res;
  }

  async deleteByPattern(pattern: string): Promise<number> {
    let pipeline = this.client.pipeline();
    let count = 0;

    for await (const key of this.scanKeys(pattern)) {
      pipeline.del(key);
      count++;

      if (count % 1000 === 0) {
        await pipeline.exec();
        pipeline = this.client.pipeline();
      }
    }

    if (count % 1000 !== 0) {
      await pipeline.exec();
    }
    return count;
  }
}
