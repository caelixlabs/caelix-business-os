import { Injectable, Logger } from '@nestjs/common';

import {
  EventHandler,
  IEventHandler,
} from '@/common/ddd';

import { OrganizationCreatedEvent } from '../../domain/events';

@Injectable()
@EventHandler(OrganizationCreatedEvent)
export class AuditLogHandler
  implements IEventHandler<OrganizationCreatedEvent>
{
  private readonly logger = new Logger(
    AuditLogHandler.name,
  );

  async handle(
    event: OrganizationCreatedEvent,
  ): Promise<void> {
    this.logger.log(
      `Audit organization creation ${event.organizationId}`,
    );
  }
}