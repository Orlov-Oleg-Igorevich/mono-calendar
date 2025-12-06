import { IsString } from 'class-validator';

export namespace DeleteTaskEvent {
  export const topic = 'calendar.delete-task.event';

  export class Request {
    @IsString()
    taskId: string;
  }
  export class Response {}
}
