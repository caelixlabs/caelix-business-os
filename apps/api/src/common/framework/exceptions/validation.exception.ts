import { ExceptionCode } from './exception-codes';
import { ApplicationException } from './application.exception';

export class ValidationException extends ApplicationException {
  constructor(
    message: string,
    details?: unknown,
  ) {
    super(
      ExceptionCode.VALIDATION_ERROR,
      message,
      details,
    );
  }
}