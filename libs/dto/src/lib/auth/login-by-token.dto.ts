import { RequestType } from '@mono-calendar/interface';

export namespace LoginByTokenDto {
  export const topic = 'login';
  export const path = 'account';
  export const requestType = RequestType.GET;

  export class Request {}
  export class Response {
    accessToken: string;
    expiresIn: number;
  }
}
