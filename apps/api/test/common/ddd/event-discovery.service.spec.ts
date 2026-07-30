import 'reflect-metadata';

import { Injectable } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { DiscoveryModule } from '@nestjs/core';

import {
  EventBus,
  EventDiscoveryService,
  EventHandler,
  EventRegistry,
  IEventHandler,
  DomainEvent,
} from '@/common/ddd';

class OrganizationCreatedEvent implements DomainEvent {
  readonly occurredOn = new Date();
}

@Injectable()
@EventHandler(OrganizationCreatedEvent)
class HandlerOne
  implements IEventHandler<OrganizationCreatedEvent>
{
  async handle(): Promise<void> {}
}

@Injectable()
@EventHandler(OrganizationCreatedEvent)
class HandlerTwo
  implements IEventHandler<OrganizationCreatedEvent>
{
  async handle(): Promise<void> {}
}

describe('EventDiscoveryService', () => {
  let registry: EventRegistry;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [DiscoveryModule],
      providers: [
        EventRegistry,
        EventBus,
        EventDiscoveryService,

        HandlerOne,
        HandlerTwo,
      ],
    }).compile();

    await moduleRef.init();

    registry = moduleRef.get(EventRegistry);
  });

  afterEach(() => {
    registry.clear();
  });

  it('should register decorated handlers', () => {
    const handlers = registry.getHandlers(
      OrganizationCreatedEvent.name,
    );

    expect(handlers).toHaveLength(2);
    expect(handlers[0]).toBeInstanceOf(HandlerOne);
    expect(handlers[1]).toBeInstanceOf(HandlerTwo);
  });
});

@Injectable()
class NotAnEventHandler {}

it('should ignore providers without @EventHandler', async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [DiscoveryModule],
    providers: [
      EventRegistry,
      EventBus,
      EventDiscoveryService,

      HandlerOne,
      NotAnEventHandler,
    ],
  }).compile();

  await moduleRef.init();

  const registry = moduleRef.get(EventRegistry);

  expect(
    registry.getHandlers(
      OrganizationCreatedEvent.name,
    ),
  ).toHaveLength(1);
});