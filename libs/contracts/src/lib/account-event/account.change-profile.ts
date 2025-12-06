import { IsEmail, IsString, IsOptional } from 'class-validator';

export namespace ChangeProfileEvent {
  export const topic = 'account.change-profile.event';

  export class Request {
    @IsString()
    userId: string;

    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    avatarUrl: string | null;

    @IsString()
    @IsEmail()
    email: string;
  }
  export class Response {}
}
