import { ValidateNested } from 'class-validator';
import { CreateCategoryDto } from '@mono-calendar/dto';
import { ICategoryViewModel } from '@mono-calendar/interface';
import { Type } from 'class-transformer';

export namespace CalendarCreateCategory {
  export const topic = '';
  export const path = 'categories';

  export class Request {
    @ValidateNested()
    @Type()
    categoryFields: CreateCategoryDto.Request;
  }
  export class Response implements ICategoryViewModel {
    id: string;
    name: string;
    color: string;
  }
}
