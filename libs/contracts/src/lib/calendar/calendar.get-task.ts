import { GetTaskDetailsDto } from '@mono-calendar/dto';

export namespace CalendarGetTask {
  export const topic = ':id';
  export const path = 'tasks';

  export class Request {}
  export class Response extends GetTaskDetailsDto.Response {}
}
