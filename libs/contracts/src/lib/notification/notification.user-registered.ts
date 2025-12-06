import { IsEmail, IsString } from 'class-validator';

export namespace NotificationUserRegistered {
  export const topic = 'notification.user-registered.event';

  export class Request {
    @IsString()
    confirmEmailToken: string;

    @IsEmail()
    email: string;
  }
  export class Response {}
}
