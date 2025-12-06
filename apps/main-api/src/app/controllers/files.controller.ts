import {
  Controller,
  HttpCode,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from '../services/files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import 'multer';
import { Request } from 'express';
import { JwtAuthGuard } from '../guards/jwt.guard';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('upload-avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ): Promise<void> {
    await this.filesService.uploadAvatar(req.user.id, file);
  }
}
