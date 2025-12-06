import { IsString } from 'class-validator';

export namespace AccountLogout {
  export const topic = 'account.logout.command';

  export class Request {
    @IsString()
    userId: string;

    @IsString()
    accessToken: string;
  }
  export class Response {}
}
