import {
  Prisma,
  DomainEvent as PrismaDomainEvent,
} from '@caelix-business-os/database';
import { DomainEvent } from '@/common/ddd';
import { customUUID } from '@/kernel/utility/uuid';
import { StoredDomainEvent } from '../domain';

export class DomainEventMapper {
  static fromDomainEvent(
    aggregateId: string,
    aggregateType: string,
    event: DomainEvent,
  ): StoredDomainEvent {
    return StoredDomainEvent.create({
      id: customUUID.generate(),
      aggregateId,
      aggregateType,
      eventName: event.constructor.name,
      payload: JSON.parse(JSON.stringify(event)) as Prisma.JsonObject,
      occurredAt: event.occurredOn,
      publishedAt: null,
    });
  }

  static toPersistence(entity: StoredDomainEvent) {
    return {
      id: entity.id,
      aggregateId: entity.aggregateId,
      aggregateType: entity.aggregateType,
      eventName: entity.eventName,
      payload: entity.payload as Prisma.InputJsonValue,
      occurredAt: entity.occurredAt,
      publishedAt: entity.publishedAt,
    };
  }

  static toDomain(model: PrismaDomainEvent): StoredDomainEvent {
    return StoredDomainEvent.create({
      id: model.id,
      aggregateId: model.aggregateId,
      aggregateType: model.aggregateType,
      eventName: model.eventName,
      payload: model.payload as Prisma.JsonObject,
      occurredAt: model.occurredAt,
      publishedAt: model.publishedAt,
    });
  }
}
