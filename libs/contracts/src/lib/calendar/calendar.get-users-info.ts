import { IUserViewModel } from '@mono-calendar/interface';
import { IsArray, IsString } from 'class-validator';

export namespace CalendarGetUsersInfo {
  export const topic = 'calendar.get-users-info.command';

  export class Request {
    @IsArray()
    @IsString({ each: true })
    userIds: string[];
  }
  export class Response {
    users: IUserViewModel[];
  }
}
