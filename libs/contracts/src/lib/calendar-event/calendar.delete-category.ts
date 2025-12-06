import { IsString } from 'class-validator';

export namespace DeleteCategoryEvent {
  export const topic = 'calendar.delete-category.event';

  export class Request {
    @IsString()
    categoryId: string;
  }
  export class Response {}
}
