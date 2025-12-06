import { IUser, RequestType } from '@mono-calendar/interface';
import { IsString } from 'class-validator';

export namespace ChangeProfileDto {
  export const topic = '';
  export const path = 'account';
  export const requestType = RequestType.PATCH;

  export class Request implements Pick<IUser, 'name'> {
    @IsString()
    name: string;
  }
  export class Response {
    email: string;
    name: string;
    avatarUrl: string | null;
  }
}
