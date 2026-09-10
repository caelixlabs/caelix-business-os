import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

import {
  ApplicationException,
  ExceptionCode,
} from '@/common/framework/exceptions';

import { ErrorResponse } from '@/common/responses';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();

    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    /**
     * Handle Application Exceptions
     */
    if (exception instanceof ApplicationException) {
      const body: ErrorResponse = {
        success: false,
        code: exception.code,
        message: exception.message,
        timestamp: new Date().toISOString(),
        path: request.url,
        details: exception.details,
      };

      response.status(this.getStatus(exception)).json(body);
      return;
    }

    /**
     * Handle NestJS HTTP Exceptions
     */
    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();

      let message = exception.message;
      let details: unknown;

      if (typeof exceptionResponse === 'object') {
        const res = exceptionResponse as Record<string, unknown>;

        message =
          typeof res.message === 'string' ? res.message : exception.message;

        details = res;
      }

      const body: ErrorResponse = {
        success: false,
        code: HttpStatus[exception.getStatus()],
        message,
        timestamp: new Date().toISOString(),
        path: request.url,
        details,
      };

      response.status(exception.getStatus()).json(body);
      return;
    }

    /**
     * Handle Unknown Exceptions
     */
    this.logger.error(exception);

    const body: ErrorResponse = {
      success: false,
      code: ExceptionCode.INTERNAL_SERVER_ERROR,
      message: 'An unexpected error occurred.',
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(body);
  }

  private getStatus(exception: ApplicationException): HttpStatus {
    switch (exception.code) {
      case ExceptionCode.ENTITY_NOT_FOUND:
        return HttpStatus.NOT_FOUND;

      case ExceptionCode.CONFLICT:
        return HttpStatus.CONFLICT;

      case ExceptionCode.VALIDATION_ERROR:
        return HttpStatus.BAD_REQUEST;

      case ExceptionCode.BUSINESS_RULE_VIOLATION:
        return HttpStatus.UNPROCESSABLE_ENTITY;

      case ExceptionCode.UNAUTHORIZED:
        return HttpStatus.UNAUTHORIZED;

      case ExceptionCode.FORBIDDEN:
        return HttpStatus.FORBIDDEN;

      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
}
