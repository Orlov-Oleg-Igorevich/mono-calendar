import { RequestContext } from './request-context.type';

declare global {
  namespace Express {
    interface Request {
      context: RequestContext;
    }
  }
}
