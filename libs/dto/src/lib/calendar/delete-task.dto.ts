import { RequestType } from '@mono-calendar/interface';

export namespace DeleteTaskDto {
  export const topic = ':id';
  export const path = 'calendar';
  export const requestType = RequestType.DELETE;

  export class Request {}
  export class Response {}
}
