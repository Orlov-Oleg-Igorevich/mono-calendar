import { IsString } from 'class-validator';

export namespace ChangeCategoryEvent {
  export const topic = 'calendar.change-category.event';

  export class Request {
    @IsString()
    categoryId: string;
    @IsString()
    userId: string;
  }
  export class Response {}
}
