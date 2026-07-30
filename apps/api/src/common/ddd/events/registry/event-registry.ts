import { Injectable } from '@nestjs/common';

import { IEventHandler } from '../interfaces';

@Injectable()
export class EventRegistry {
  private readonly handlers = new Map<
    string,
    IEventHandler[]
  >();

  register(
    eventName: string,
    handler: IEventHandler,
  ): void {
    const handlers =
      this.handlers.get(eventName) ?? [];

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