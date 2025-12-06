import { IsString } from 'class-validator';

export namespace AccountConfirmEmail {
  export const topic = 'account.confirm-email.command';

  export class Request {
    @IsString()
    token: string;
  }
  export class Response {}
}
