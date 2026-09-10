import { AggregateRoot } from '@/common/ddd';
import { Prisma } from '@caelix-business-os/database';

export interface CreateStoredDomainEventProps {
  id: string;
  aggregateId: string;
  aggregateType: string;
  eventName: string;
  payload: Prisma.JsonObject;
  occurredAt: Date;
  publishedAt?: Date | null;
}

export class StoredDomainEvent extends AggregateRoot<string> {
  constructor(
    public readonly id: string,
    public readonly aggregateId: string,
    public readonly aggregateType: string,
    public readonly eventName: string,
    public readonly payload: Prisma.JsonObject,
    public readonly occurredAt: Date,
    public publishedAt?: Date | null,
  ) {
    super(id);
  }

  static create(props: CreateStoredDomainEventProps) {
    return new StoredDomainEvent(
      props.id,
      props.aggregateId,
      props.aggregateType,
      props.eventName,
      props.payload,
      props.occurredAt,
      props.publishedAt ?? null,
    );
  }

  markPublished() {
    this.publishedAt = new Date();
  }
}
