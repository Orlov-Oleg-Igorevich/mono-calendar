import { RequestType } from '@mono-calendar/interface';

export namespace GetProfileDto {
  export const topic = '';
  export const path = 'account';
  export const requestType = RequestType.GET;

  export class Request {}
  export class Response {
    email: string;
    name: string;
    avatarUrl: string | null;
  }
}
