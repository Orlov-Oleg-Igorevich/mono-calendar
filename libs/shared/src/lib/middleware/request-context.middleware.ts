import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response } from 'express';
import { RequestContext } from '../types/request-context.type';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void): void {
    const userId = req.headers['x-user-id'] as string | undefined;
    const requestId = req.headers['x-request-id'] as string | undefined;

    if (!userId) {
      throw new BadRequestException('Missing X-User-ID header');
    }

    (req as any).context = {
      userId,
      requestId: requestId || 'unknown',
    } satisfies RequestContext;

    next();
  }
}
