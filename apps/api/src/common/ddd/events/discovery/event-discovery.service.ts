import { Injectable, OnModuleInit, Logger } from '@nestjs/common';

import { DiscoveryService } from '@nestjs/core';

import { EVENT_HANDLER_METADATA, EventHandlerMetadata } from '../constants';
import { EventRegistry } from '../registry';

@Injectable()
export class EventDiscoveryService
  implements OnModuleInit
{
  private readonly logger = new Logger(
    EventDiscoveryService.name,
  );

  constructor(
    private readonly discovery: DiscoveryService,
    private readonly registry: EventRegistry,
  ) {}

  onModuleInit(): void {
    this.registerHandlers();
  }

  private registerHandlers(): void {
    const providers =
      this.discovery.getProviders();

    // DiscoveryService.getProviders() walks the module *import graph*,
    // not a deduplicated set of provider singletons — a module
    // imported from several other modules (e.g. RbacModule, imported
    // by UsersModule, AuthModule, and AppModule directly) surfaces its
    // providers once per incoming path, even though NestJS still only
    // ever instantiates ONE singleton. Track seen instances so a
    // handler is registered — and logged — exactly once regardless of
    // how many paths reach it.
    const seenInstances = new Set<unknown>();

    for (const wrapper of providers) {
      const instance = wrapper.instance;

      if (!instance || seenInstances.has(instance)) {
        continue;
      }

      const target = instance.constructor;

      const metadata = Reflect.getMetadata(
        EVENT_HANDLER_METADATA,
        target,
      ) as EventHandlerMetadata | undefined;

      if (!metadata) {
        continue;
      }

      seenInstances.add(instance);

      this.registry.register(
        metadata.event.name,
        instance,
      );

      this.logger.log(
        `${target.name} registered for ${metadata.event.name}`,
      );
    }
  }
}