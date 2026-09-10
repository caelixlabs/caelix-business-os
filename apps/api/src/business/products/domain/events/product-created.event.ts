import {
  DomainEvent,
} from '@/common/ddd';

export class ProductCreatedEvent implements DomainEvent{
  readonly occurredOn: Date;

  constructor(
    public readonly productId: string,
    public readonly organizationId: string,
    public readonly name: string,
  ) {
    this.occurredOn = new Date();
  }
}