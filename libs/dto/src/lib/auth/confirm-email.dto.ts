import { RequestType } from '@mono-calendar/interface';
import { IsString } from 'class-validator';

export namespace ConfirmEmailDto {
  export const topic = 'confirm-email';
  export const path = 'account';
  export const requestType = RequestType.POST;

  export class Request {
    @IsString()
    token: string;
  }

  export class Response {}
}
