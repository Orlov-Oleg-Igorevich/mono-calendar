import { ICategoryViewModel, IColorViewModel } from '@mono-calendar/interface';

export namespace CalendarGetCategories {
  export const topic = '';
  export const path = 'categories';

  export class Request {}
  export class Response {
    categories: (ICategoryViewModel & Partial<Pick<IColorViewModel, 'color'>>)[];
  }
}
