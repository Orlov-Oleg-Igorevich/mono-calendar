import { ICategory, ICategoryViewModel, RequestType } from '@mono-calendar/interface';
import { IsString } from 'class-validator';

export namespace CreateCategoryDto {
  export const topic = 'categories';
  export const path = 'calendar';
  export const requestType = RequestType.POST;

  export class Request implements Pick<ICategory, 'color' | 'name'> {
    @IsString()
    color: string;

    @IsString()
    name: string;
  }
  export class Response implements ICategoryViewModel {
    id: string;
    name: string;
    color: string;
  }
}
