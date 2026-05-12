import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { errorResponse } from 'src/common/responses/error.response';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const response = exception.getResponse();

      const message =
        typeof response === 'string'
          ? response
          : (response as any).message || exception.message;

      const errorCode =
        typeof response === 'object' && (response as any).errorCode
          ? (response as any).errorCode
          : this.getDefaultErrorCode(statusCode);

      return res.status(statusCode).json(
        errorResponse(
          errorCode,
          Array.isArray(message) ? message.join(', ') : message,
          statusCode,
          req.url,
        ),
      );
    }

    this.logger.error(exception);

    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
      errorResponse(
        'INTERNAL_SERVER_ERROR',
        'Unexpected server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
        req.url,
      ),
    );
  }

  private getDefaultErrorCode(statusCode: number): string {
    switch (statusCode) {
      case HttpStatus.BAD_REQUEST:
        return 'BAD_REQUEST';
      case HttpStatus.UNAUTHORIZED:
        return 'UNAUTHORIZED';
      case HttpStatus.FORBIDDEN:
        return 'FORBIDDEN';
      case HttpStatus.NOT_FOUND:
        return 'NOT_FOUND';
      case HttpStatus.CONFLICT:
        return 'CONFLICT';
      default:
        return 'INTERNAL_SERVER_ERROR';
    }
  }
}