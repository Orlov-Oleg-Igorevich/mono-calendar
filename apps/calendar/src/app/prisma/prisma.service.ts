import { Injectable } from '@nestjs/common';
import { PrismaClient } from './generated/prisma/client';
import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { TypedConfigService } from '../common/typed-config/typed-config.service';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly prisma: PrismaClient;

  constructor(private readonly configService: TypedConfigService) {
    const connectionString = configService.databaseUrl;
    const adapter = new PrismaPg({ connectionString });
    this.prisma = new PrismaClient({ adapter });
  }
  async onModuleInit(): Promise<void> {
    await this.prisma.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.prisma.$disconnect();
  }

  public getClient(): PrismaClient {
    return this.prisma;
  }
}
