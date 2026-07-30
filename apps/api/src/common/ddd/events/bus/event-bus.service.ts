import { Injectable } from '@nestjs/common';

import {
  DomainEvent,
  IEventBus,
} from '../interfaces';

import { EventRegistry } from '../registry/event-registry';

@Injectable()
export class EventBus
  implements IEventBus
{
  constructor(
    private readonly registry: EventRegistry,
  ) {}

  async publish(
    event: DomainEvent,
  ): Promise<void> {
    const handlers =
      this.registry.getHandlers(
        event.constructor.name,
      );

    for (const handler of handlers) {
      await handler.handle(event);
    }
  }

  async publishAll(
    events: DomainEvent[],
  ): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }
}