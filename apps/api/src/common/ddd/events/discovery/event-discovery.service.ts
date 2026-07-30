import {
  Injectable,
  OnModuleInit,
  Logger,
} from '@nestjs/common';

import {
  DiscoveryService,
} from '@nestjs/core';

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

    for (const wrapper of providers) {
      const instance = wrapper.instance;

      if (!instance) {
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