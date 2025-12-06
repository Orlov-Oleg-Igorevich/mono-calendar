import { IsString } from 'class-validator';

export namespace ChangeTaskEvent {
  export const topic = 'calendar.change-task.event';

  export class Request {
    @IsString()
    taskId: string;
  }
  export class Response {}
}
