import { ValidateNested } from 'class-validator';
import { ChangeTaskDto } from '@mono-calendar/dto';
import { ITaskViewModel } from '@mono-calendar/interface';
import { Type } from 'class-transformer';

export namespace CalendarChangeTask {
  export const topic = ':id';
  export const path = 'tasks';

  export class Request {
    @ValidateNested()
    @Type(() => ChangeTaskDto.Request)
    taskFields: ChangeTaskDto.Request;
  }
  export class Response implements ITaskViewModel {
    userId: string;
    taskId: string;
    authorId: string;
    isShared: boolean;
    title: string;
    address: string | null;
    startDate: Date;
    endDate: Date | null;
    color: string | null;
    category1Id: string | null;
  }
}
