import { RequestType } from '@mono-calendar/interface';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export namespace RegisterDto {
  export const topic = 'register';
  export const path = 'account';
  export const requestType = RequestType.POST;

  export class Request {
    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsOptional()
    @IsString()
    name?: string;
  }

  export class Response {}
}
