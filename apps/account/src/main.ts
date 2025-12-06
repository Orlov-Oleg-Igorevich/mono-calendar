/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import '@mono-calendar/shared';
import { execSync } from 'node:child_process';

import { config } from 'dotenv';
import { resolve } from 'path';

async function bootstrap(): Promise<void> {
  config({ path: resolve(__dirname, '../../../envs/.calendar.env') });

  const app = await NestFactory.create(AppModule);

  // Применяем миграции от суперпользователя
  if (process.env.NODE_ENV === 'production') {
    // Теперь process.env содержит переменные
    const migrateUrl = process.env.DATABASE_URL_MIGRATE;
    if (!migrateUrl) {
      throw new Error('DATABASE_URL_MIGRATE is required for migrations');
    }

    execSync('npx prisma migrate deploy --config prisma.config.ts', {
      env: {
        ...process.env,
        DATABASE_URL: migrateUrl, // ← подменяем URL только для миграций
      },
      stdio: 'inherit',
    });
  }

  const port = process.env.ACCOUNT_PORT || 3004;
  await app.listen(port);
  Logger.log(`🚀 Application account is running`);
}

bootstrap();
