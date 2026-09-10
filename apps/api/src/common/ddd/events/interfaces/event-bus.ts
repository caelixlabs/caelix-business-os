import { DomainEvent } from './domain-event';

export interface IEventBus {
  publish(event: DomainEvent): Promise<void>;

  publishAll(events: DomainEvent[]): Promise<void>;
}
