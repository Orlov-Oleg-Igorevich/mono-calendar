import {
  ITaskViewModel,
  IUserViewModel,
  ICategoryViewModel,
  IColorViewModel,
  RequestType,
} from '@mono-calendar/interface';

export namespace GetCalendarDto {
  export const topic = '';
  export const path = 'calendar';
  export const requestType = RequestType.GET;

  export class Request {}
  export class Response {
    tasks: ITaskViewModel[];
    authors: IUserViewModel[];
    categories: (ICategoryViewModel & Pick<IColorViewModel, 'color' | 'userId'>)[];
  }
}
