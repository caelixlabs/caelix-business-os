import { ExceptionCode } from './exception-codes';
import { ApplicationException } from './application.exception';

export class BusinessRuleException extends ApplicationException {
  constructor(message: string) {
    super(ExceptionCode.BUSINESS_RULE_VIOLATION, message);
  }
}
