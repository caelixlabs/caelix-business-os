import { ExceptionCode } from './exception-codes';
import { ApplicationException } from './application.exception';

export class ForbiddenException extends ApplicationException {
  constructor(message = 'Forbidden') {
    super(
      ExceptionCode.FORBIDDEN,
      message,
    );
  }
}