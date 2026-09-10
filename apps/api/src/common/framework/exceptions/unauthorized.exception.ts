import { ExceptionCode } from './exception-codes';
import { ApplicationException } from './application.exception';

export class UnauthorizedException extends ApplicationException {
  constructor(message = 'Unauthorized') {
    super(ExceptionCode.UNAUTHORIZED, message);
  }
}
