import { RequestType } from '@mono-calendar/interface';

export namespace DeleteCategoryDto {
  export const topic = 'categories/:id';
  export const path = 'calendar';
  export const requestType = RequestType.DELETE;

  export class Request {}
  export class Response {}
}
