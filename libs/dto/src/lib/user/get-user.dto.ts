import { IUserViewModel, RequestType } from '@mono-calendar/interface';

export namespace GetUserDto {
  export const topic = ':id';
  export const path = 'account';
  export const requestType = RequestType.GET;

  export class Request {}
  export class Response implements IUserViewModel {
    id: string;
    email: string;
    name: string;
    avatarUrl: string | null;
  }
}
