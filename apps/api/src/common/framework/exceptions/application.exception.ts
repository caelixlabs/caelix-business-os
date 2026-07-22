import { ExceptionCode } from './exception-codes';

export abstract class ApplicationException extends Error {
  constructor(
    public readonly code: ExceptionCode,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);

    this.name = this.constructor.name;

    Error.captureStackTrace?.(this, this.constructor);
  }
}