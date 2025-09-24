import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let httpStatus = 500;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      const errRes = exception.getResponse();

      httpStatus = exception.getStatus();
      message = typeof errRes === 'string' ? errRes : (errRes as any).message;

      this.logger.warn(
        `${request.method}${request.url} - ${httpStatus} - ${exception.name}`,
      );

      const responseBody = {
        statusCode: httpStatus,
        message,
        path: request.url,
        exception: exception.name,
        timestamp: new Date().toISOString(),
      };

      httpAdapter.reply(response, responseBody, httpStatus);
    }
  }
}
