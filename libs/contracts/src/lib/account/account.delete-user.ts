import { IsString } from 'class-validator';

export namespace AccountDeleteUser {
  export const topic = 'account.delete-user.command';

  export class Request {
    @IsString()
    userId: string;

    @IsString()
    accessToken: string;
  }
  export class Response {}
}
