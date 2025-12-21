import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody =
      exception instanceof HttpException ? exception.getResponse() : null;

    const message = this.extractMessage(responseBody, exception);

    const payload = {
      statusCode: status,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    const logMessage = `${request.method} ${request.url} -> ${status}`;

    if (status >= 500) {
      this.logger.error(logMessage, exception instanceof Error ? exception.stack : undefined);
    } else {
      this.logger.warn(logMessage);
    }

    response.status(status).json(payload);
  }

  private extractMessage(responseBody: unknown, exception: unknown) {
    if (typeof responseBody === 'string') {
      return responseBody;
    }

    if (responseBody && typeof responseBody === 'object' && 'message' in responseBody) {
      return (responseBody as { message?: unknown }).message;
    }

    if (exception instanceof Error) {
      return exception.message;
    }

    return 'Internal server error';
  }
}
