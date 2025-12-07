/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { HttpStatus, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import cookieParser from 'cookie-parser';

import { config } from 'dotenv';
import { resolve } from 'path';

async function bootstrap(): Promise<void> {
  config({ path: resolve(__dirname, '../../../envs/.main.env') });

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;
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
  app.use(cookieParser());
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
