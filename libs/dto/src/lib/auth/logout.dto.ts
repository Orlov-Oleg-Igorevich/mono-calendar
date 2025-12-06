import { RequestType } from '@mono-calendar/interface';

export namespace LogoutDto {
  export const topic = 'logout';
  export const path = 'account';
  export const requestType = RequestType.GET;

  export class Request {}
  export class Response {}
}
