import { ExceptionCode } from './exception-codes';
import { ApplicationException } from './application.exception';

export class ConflictException extends ApplicationException {
  constructor(message: string) {
    super(
      ExceptionCode.CONFLICT,
      message,
    );
  }
}