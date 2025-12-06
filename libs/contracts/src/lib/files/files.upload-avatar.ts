import { IsString } from 'class-validator';

export namespace FilesUploadAvatar {
  export const topic = 'files.upload-avatar.command';

  export class Request {
    @IsString()
    storageKey: string;

    @IsString()
    userId: string;
  }
  export class Response {
    url: string;
  }
}
