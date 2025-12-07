import { IUserViewModel, RequestType } from '@mono-calendar/interface';

export namespace GetProfileDto {
  export const topic = '';
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
