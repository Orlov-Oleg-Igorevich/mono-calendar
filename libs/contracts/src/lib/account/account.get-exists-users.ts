import { IsArray, IsString } from 'class-validator';

export namespace AccountGetExistingUsers {
  export const topic = 'exists';
  export const path = 'users';

  export class Request {
    @IsArray()
    @IsString({ each: true })
    userIds: string[];
  }
  export class Response {
    userIds: string[];
  }
}
