import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, originalUrl } = req;
    const startTime = Date.now();

    // Prevent sensitive fields from leaking into console logs
    const sanitizedBody = this.sanitize(req.body);

    return next.handle().pipe(
      tap(() => {
        const res = context.switchToHttp().getResponse();
        const statusCode = res.statusCode;
        const duration = Date.now() - startTime;
        this.logger.log(`${method} ${originalUrl} ${statusCode} - ${duration}ms`);
      }),
    );
  }

  private sanitize(obj: any): any {
    if (!obj || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map((item) => this.sanitize(item));

    const sensitiveKeys = [
      'fileData',
      'password',
      'token',
      'authorization',
      'secret',
      'ocrText',
      'policyNumber',
      'encryptionKey',
    ];

    const copy: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (sensitiveKeys.includes(key)) {
        copy[key] = '[REDACTED_CONFIDENTIAL]';
      } else if (typeof value === 'object' && value !== null) {
        copy[key] = this.sanitize(value);
      } else {
        copy[key] = value;
      }
    }
    return copy;
  }
}
