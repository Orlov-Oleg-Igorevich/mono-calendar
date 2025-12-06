import { IUserViewModel, RequestType } from '@mono-calendar/interface';
import { IsString } from 'class-validator';

export namespace GetMailMatchesDto {
  export const topic = 'matches';
  export const path = 'account';
  export const requestType = RequestType.POST;

  export class Request {
    @IsString()
    emailPrefix: string;
  }
  export class Response {
    users: IUserViewModel[];
  }
}
