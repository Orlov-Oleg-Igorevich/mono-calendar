import { IUser } from '@mono-calendar/interface';
import { IsString } from 'class-validator';

export namespace UploadAvatarEvent {
  export const topic = 'files.upload-avatar.event';

  export class Request implements Pick<IUser, 'id' | 'avatarUrl'> {
    @IsString()
    id: string;

    @IsString()
    avatarUrl: string;
  }
  export class Response {}
}
