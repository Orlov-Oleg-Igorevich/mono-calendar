import { IsEmail, IsOptional, IsString } from 'class-validator';

export namespace AccountRegister {
  export const topic = 'account.register.command';

  export class Request {
    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;
  }
  export class Response {}
}
