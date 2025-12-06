import { ValidateNested } from 'class-validator';
import { ChangeCategoryDto } from '@mono-calendar/dto';
import { ICategoryViewModel } from '@mono-calendar/interface';
import { Type } from 'class-transformer';

export namespace CalendarChangeCategory {
  export const topic = ':id';
  export const path = 'categories';

  export class Request {
    @ValidateNested()
    @Type(() => ChangeCategoryDto.Request)
    categoryFields: ChangeCategoryDto.Request;
  }
  export class Response implements ICategoryViewModel {
    id: string;
    name: string;
    color: string;
  }
}
