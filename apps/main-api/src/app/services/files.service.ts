import { BadRequestException, Injectable } from '@nestjs/common';
import { StorageService } from '../common/storage/storage.service';
import { RMQError, RMQService } from 'nestjs-rmq';
import 'multer';
import { FilesUploadAvatar } from '@mono-calendar/contracts';

@Injectable()
export class FilesService {
  constructor(
    private readonly storageService: StorageService,
    private readonly rmqService: RMQService,
  ) {}

  async uploadAvatar(
    userId: string,
    file: Express.Multer.File,
  ): Promise<FilesUploadAvatar.Response> {
    // 1. Загружаем оригинал в MinIO
    const originalKey = `avatars/${userId}/original-${Date.now()}-${file.originalname}`;
    await this.storageService.upload(originalKey, file.buffer, true);

    // 2. Отправляем задачу на обработку в микросервис files
    try {
      const result = await this.rmqService.send<
        FilesUploadAvatar.Request,
        FilesUploadAvatar.Response
      >(FilesUploadAvatar.topic, {
        storageKey: originalKey,
        userId,
      });
      return result; // { url: "http://localhost:9000/app-files/avatars/user123/256.webp" }
    } catch (e) {
      if (e instanceof RMQError) {
        throw new BadRequestException(e.message);
      }
      throw new BadRequestException('Непредвиденная ошибка, попробуйте повторить запрос');
    }
  }
}
