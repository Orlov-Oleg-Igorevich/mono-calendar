import { Body, Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { FilesUploadAvatar } from '@mono-calendar/contracts';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @RMQValidate()
  @RMQRoute('files.process.avatar')
  async processAvatar(
    @Body() payload: FilesUploadAvatar.Request,
  ): Promise<FilesUploadAvatar.Response> {
    const { userId, storageKey } = payload;
    return this.appService.uploadAvatar(storageKey, userId);
  }
}
