import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

export default async function validateAndTransform(input: any, to: any): Promise<any> {
  const dto = plainToInstance(to, input, {
    enableImplicitConversion: true,
  });

  const errors = await validate(dto, {
    whitelist: true,
    forbidNonWhitelisted: true,
    skipMissingProperties: false,
    skipNullProperties: false,
    skipUndefinedProperties: false,
  });

  if (errors.length > 0) {
    const messages = errors.flatMap((err) => Object.values(err.constraints || {}));
    throw new BadRequestException(messages);
  }

  return dto;
}
