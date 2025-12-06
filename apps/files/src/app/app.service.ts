import { Injectable } from '@nestjs/common';
import { StorageService } from './common/storage/storage.service';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AppService {
  constructor(private readonly storageService: StorageService) {}
  async uploadAvatar(storageKey: string, userId: string): Promise<{ url: string }> {
    // 1. Скачиваем оригинал
    const originalBuffer = await this.storageService.download(storageKey);

    // 2. Генерируем WebP (256x256)
    const webpBuffer = await sharp(originalBuffer)
      .resize(256, 256, { fit: 'cover' })
      .webp({ quality: 85 })
      .toBuffer();

    // 3. Сохраняем в MinIO
    const webpKey = `avatars/${userId}/${uuidv4()}.webp`;
    await this.storageService.upload(webpKey, webpBuffer, true);

    // 4. Возвращаем публичный URL
    return { url: this.storageService.getPublicUrl(webpKey) };
  }
}
