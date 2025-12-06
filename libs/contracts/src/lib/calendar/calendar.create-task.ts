import { ValidateNested } from 'class-validator';
import { CreateTaskDto } from '@mono-calendar/dto';
import { ITaskViewModel } from '@mono-calendar/interface';
import { Type } from 'class-transformer';

export namespace CalendarCreateTask {
  export const topic = '';
  export const path = 'tasks';

  export class Request {
    @ValidateNested()
    @Type(() => CreateTaskDto.Request)
    taskFields: CreateTaskDto.Request;
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
