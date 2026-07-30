import { Injectable } from '@nestjs/common';

import {
  EventHandler,
  IEventHandler,
} from '@/common/ddd';

import { OrganizationCreatedEvent } from '../../domain/events';

@Injectable()
@EventHandler(OrganizationCreatedEvent)
export class CreateDefaultBranchHandler
  implements IEventHandler<OrganizationCreatedEvent>
{
  async handle(
    event: OrganizationCreatedEvent,
  ): Promise<void> {

    console.log(
      `Creating default branch for ${event.organizationId}`,
    );

  }
}