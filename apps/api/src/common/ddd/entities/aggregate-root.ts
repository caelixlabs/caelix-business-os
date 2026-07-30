import { DomainEvent } from '../events';
import { Entity } from './entity';

export abstract class AggregateRoot<TId = string> extends Entity<TId> {
  private readonly domainEvents: DomainEvent[] = [];

  protected constructor(id: TId) {
    super(id);
  }

  protected addDomainEvent(event: DomainEvent): void {
    this.domainEvents.push(event);
  }

  public getDomainEvents(): DomainEvent[] {
    return [...this.domainEvents];
  }

   public clearDomainEvents(): void {
    this.domainEvents.length = 0;
  }

  public pullDomainEvents(): DomainEvent[] {
    const events = [...this.domainEvents];
    this.clearDomainEvents();
    return events;
  }
}