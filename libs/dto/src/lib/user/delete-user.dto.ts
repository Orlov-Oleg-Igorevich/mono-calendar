import { RequestType } from '@mono-calendar/interface';

export namespace DeleteUserDto {
  export const topic = '';
  export const path = 'account';
  export const requestType = RequestType.DELETE;

  export class Request {}
  export class Response {}
}
