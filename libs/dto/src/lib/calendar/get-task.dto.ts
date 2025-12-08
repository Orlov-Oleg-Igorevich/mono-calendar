import {
  IUserViewModel,
  ICategoryViewModel,
  ITask,
  IColorViewModel,
  RequestType,
} from '@mono-calendar/interface';

export namespace GetTaskDetailsDto {
  export const topic = ':id';
  export const path = 'calendar';
  export const requestType = RequestType.GET;

  export class Request {}
  export class Response {
    task: ITask;
    users: IUserViewModel[];
    categories: (ICategoryViewModel & Partial<Pick<IColorViewModel, 'color'>>)[];
  }
}
