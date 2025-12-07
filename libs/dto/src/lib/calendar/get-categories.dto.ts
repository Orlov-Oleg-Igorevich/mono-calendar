import { ICategoryViewModel, IColorViewModel, RequestType } from '@mono-calendar/interface';

export namespace GetCategoriesDto {
  export const topic = 'categories';
  export const path = 'calendar';
  export const requestType = RequestType.GET;

  export class Request {}
  export class Response {
    categories: (ICategoryViewModel & Partial<Pick<IColorViewModel, 'color'>>)[];
  }
}
