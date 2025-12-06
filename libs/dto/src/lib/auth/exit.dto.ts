import { RequestType } from '@mono-calendar/interface';

export namespace ExitDto {
  export const topic = 'exit';
  export const path = 'account';
  export const requestType = RequestType.GET;

  export class Request {}
  export class Response {}
}
