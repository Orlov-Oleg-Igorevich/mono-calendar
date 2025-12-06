/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { HttpStatus, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import '@mono-calendar/shared';
import { execSync } from 'child_process';

import { config } from 'dotenv';
import { resolve } from 'path';

async function bootstrap(): Promise<void> {
  config({ path: resolve(__dirname, '../../../envs/.calendar.env') });

  const app = await NestFactory.create(AppModule);

  // Применяем миграции от суперпользователя
  if (process.env.NODE_ENV === 'production') {
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
  const port = process.env.CALENDAR_PORT || 3005;
  app.useGlobalPipes(
    new ValidationPipe({
      // Безопасность
      whitelist: true,
      // forbidNonWhitelisted: true,
      forbidUnknownValues: true,

      // Обработка свойств
      skipMissingProperties: false,
      skipUndefinedProperties: false,
      skipNullProperties: false,

      // Преобразование
      transform: true,
      transformOptions: {
        enableImplicitConversion: false,
        exposeDefaultValues: true,
      },

      // Обработка ошибок
      // dismissDefaultMessages: false,
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      validationError: {
        target: false,
        value: true,
      },

      // Дополнительно
      validateCustomDecorators: true,
      always: false,
    }),
  );
  await app.listen(port);
  Logger.log(`🚀 Application calendar is running`);
}

bootstrap();
