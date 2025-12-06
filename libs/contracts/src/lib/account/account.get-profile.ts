import { IUserViewModel } from '@mono-calendar/interface';
import { IsString } from 'class-validator';

export namespace AccountGetProfile {
  export const topic = 'account.get-profile.query';

  export class Request {
    @IsString()
    userId: string;
  }
  export class Response implements IUserViewModel {
    id: string;
    email: string;
    avatarUrl: string | null;
    name: string;
  }
}
