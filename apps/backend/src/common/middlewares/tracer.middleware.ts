import { type AsyncStorage, InjectTracer } from '@dev/nestjs-common';
import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

export class TracerMiddleware implements NestMiddleware {
  constructor(@InjectTracer() private readonly tracer: AsyncStorage) {}

  use(req: Request, _: Response, next: NextFunction): void {
    const store = new Map<string, unknown>();

    store.set('reqId', uuidv4());
    store.set('traceId', (req.headers['x-trace-id'] as string) || uuidv4());

    this.tracer.run(store, () => next());
  }
}
