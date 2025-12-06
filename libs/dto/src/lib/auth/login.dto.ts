import { RequestType } from '@mono-calendar/interface';
import { IsEmail, IsString } from 'class-validator';

export namespace LoginDto {
  export const topic = 'login';
  export const path = 'account';
  export const requestType = RequestType.POST;

  export class Request {
    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    password: string;
  }
  export class Response {
    accessToken: string;
    expiresIn: number;
  }
}
