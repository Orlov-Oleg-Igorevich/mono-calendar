import { GetCalendarDto } from '@mono-calendar/dto';

export namespace CalendarGetCalendar {
  export const topic = '';
  export const path = 'tasks';

  export class Request {}
  export class Response extends GetCalendarDto.Response {}
}
