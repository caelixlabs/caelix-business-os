import { ExceptionCode } from './exception-codes';
import { ApplicationException } from './application.exception';

export class EntityNotFoundException extends ApplicationException {
  constructor(
    entity: string,
    id: string,
  ) {
    super(
      ExceptionCode.ENTITY_NOT_FOUND,
      `${entity} '${id}' was not found.`,
    );
  }
}