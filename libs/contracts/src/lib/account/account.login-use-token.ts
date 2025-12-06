import { IsString } from 'class-validator';

export namespace AccountLoginUseToken {
  export const topic = 'account.login-use-token.command';

  export class Request {
    @IsString()
    token: string;

    @IsString()
    sign: string;
  }
  export class Response {
    accessToken: string;
    expiresIn: number;

    refreshToken: string;
    maxAge: number;
  }
}
