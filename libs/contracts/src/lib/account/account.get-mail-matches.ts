import { IUserViewModel } from '@mono-calendar/interface';
import { IsString } from 'class-validator';

export namespace AccountGetMailMatches {
  export const topic = 'account.get-mail-matches.command';

  export class Request {
    @IsString()
    emailPrefix: string;
  }
  export class Response {
    users: IUserViewModel[];
  }
}
