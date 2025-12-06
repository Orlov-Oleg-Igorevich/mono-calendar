import { IUser } from '@mono-calendar/interface';
import { IsString } from 'class-validator';

export namespace AccountChangeProfile {
  export const topic = 'account.change-profile.command';

  export class Request implements Partial<Pick<IUser, 'name'>> {
    @IsString()
    userId: string;

    @IsString()
    name: string;
  }
  export class Response {
    email: string;
    avatarUrl: string | null;
    name: string;
  }
}
