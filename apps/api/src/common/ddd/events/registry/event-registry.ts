import { Injectable, Logger } from '@nestjs/common';

import { IEventHandler } from '../interfaces';

@Injectable()
export class EventRegistry {
  private readonly logger = new Logger(EventRegistry.name);

  private readonly handlers = new Map<
    string,
    IEventHandler[]
  >();

  /**
   * Idempotent by design: the same handler *instance* can be
   * discovered more than once if the module that declares it is
   * reachable via more than one import path in the module graph (a
   * standard NestJS provider is still a singleton in that case, but
   * DiscoveryService's provider scan is a graph walk, not a
   * deduplicated set — see EventDiscoveryService). Without this
   * guard, such a handler would run twice per event, which is exactly
   * how a "first user becomes OWNER" check went wrong: two concurrent
   * invocations racing the same read-then-write.
   */
  register(
    eventName: string,
    handler: IEventHandler,
  ): void {
    const handlers =
      this.handlers.get(eventName) ?? [];

    if (handlers.includes(handler)) {
      this.logger.debug(
        `${handler.constructor.name} is already registered for ${eventName} — skipping duplicate registration`,
      );
      return;
    }

    handlers.push(handler);

    this.handlers.set(eventName, handlers);
  }

  getHandlers(
    eventName: string,
  ): readonly IEventHandler[] {
    return this.handlers.get(eventName) ?? [];
  }

  clear(): void {
    this.handlers.clear();
  }
}