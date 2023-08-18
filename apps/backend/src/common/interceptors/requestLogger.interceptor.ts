import { CustomLogger } from '@dev/nestjs-common';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class RequestLoggerInterceptor implements NestInterceptor {
  constructor(private readonly logger: CustomLogger) {
    this.logger = logger.createScope(RequestLoggerInterceptor.name);
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> | Promise<Observable<unknown>> {
    const type = context.getType();
    let req: Request, res: Response;

    switch (type) {
      case 'http': {
        const argumentsHost = context.switchToHttp();
        req = argumentsHost.getRequest<Request>();
        res = argumentsHost.getResponse<Response>();
        break;
      }
      default:
        return next.handle();
    }

    const { method, path: url } = req;
    const now = Date.now();

    this.logger.log('Req', { url, method, startTime: now });

    return next.handle().pipe(
      tap({
        next: () => this.log(url, method, now, res),
        error: () => this.log(url, method, now, res),
      }),
    );
  }

  private log(
    url: string,
    method: string,
    started: number,
    res: Response,
  ): void {
    return this.logger.log('Res', {
      url,
      method,
      statusCode: res.statusCode,
      execTime: Date.now() - started,
    });
  }
}
