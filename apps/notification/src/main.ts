/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

import { config } from 'dotenv';
import { resolve } from 'path';

async function bootstrap(): Promise<void> {
  config({ path: resolve(__dirname, '../../../envs/.notification.env') });

  const app = await NestFactory.create(AppModule);
  // const globalPrefix = 'api';
  // app.setGlobalPrefix(globalPrefix);
  // const port = process.env.PORT || 3000;
  await app.init();
  Logger.log(`🚀 Application notification is running`);
}

bootstrap();
