import { IsString } from 'class-validator';

export namespace CreateTaskEvent {
  export const topic = 'calendar.create-task.event';

  export class Request {
    @IsString()
    taskId: string;
  }
  export class Response {}
}
