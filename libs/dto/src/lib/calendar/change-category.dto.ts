import { ICategory, ICategoryViewModel, RequestType } from '@mono-calendar/interface';
import { IsString } from 'class-validator';

export namespace ChangeCategoryDto {
  export const topic = 'categories/:id';
  export const path = 'calendar';
  export const requestType = RequestType.PATCH;

  export class Request implements Pick<ICategory, 'color'> {
    @IsString()
    color: string;
  }
  export class Response implements ICategoryViewModel {
    id: string;
    name: string;
    color: string;
    isSystem: boolean;
  }
}
