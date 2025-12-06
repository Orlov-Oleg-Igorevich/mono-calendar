import { IsOptional, IsString } from 'class-validator';

export namespace AccountExit {
  export const topic = 'account.exit.command';

  export class Request {
    @IsString()
    userId: string;

    @IsString()
    accessToken: string;

    @IsOptional()
    @IsString()
    refreshToken?: string;
  }
  export class Response {}
}
