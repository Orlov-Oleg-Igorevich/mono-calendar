import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { TypedConfigService } from '../typed-config/typed-config.service';

@Injectable()
export class StorageService {
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly publicUrlBase: string;

  constructor(private readonly configService: TypedConfigService) {
    this.bucket = this.configService.storageBucket;
    this.publicUrlBase = this.configService.storagePublicUrlBase;

    this.client = new S3Client({
      endpoint: this.configService.storageEndpoint,
      region: this.configService.storageRegion, // MinIO игнорирует регион, но SDK требует
      credentials: {
        accessKeyId: this.configService.storageAccessKeyId,
        secretAccessKey: this.configService.storageSecretAccessKey,
      },
      forcePathStyle: true, // критично для MinIO
    });
  }

  async upload(key: string, buffer: Buffer, isPublic = true): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: buffer,
      ContentType: this.getMimeType(key),
      ...(isPublic && { ACL: 'public-read' }), // работает, если политика разрешает
    });

    try {
      await this.client.send(command);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Непредвиденная ошибка. Попробуйте повторить запрос';
      throw new InternalServerErrorException(`MinIO upload failed: ${errorMessage}`);
    }
  }

  async download(key: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    try {
      const response = await this.client.send(command);
      return await this.streamToBuffer(response.Body as Readable);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Непредвиденная ошибка. Попробуйте повторить запрос';
      throw new InternalServerErrorException(`MinIO upload failed: ${errorMessage}`);
    }
  }

  getPublicUrl(key: string): string {
    return `${this.publicUrlBase}/${key}`;
  }

  private getMimeType(filename: string): string {
    if (filename.endsWith('.webp')) return 'image/webp';
    if (filename.match(/\.(jpg|jpeg)$/)) return 'image/jpeg';
    if (filename.endsWith('.png')) return 'image/png';
    return 'application/octet-stream';
  }

  private async streamToBuffer(stream: Readable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) =>
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)),
      );
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });
  }
}
