// import { AggregateRoot, IEventBus } from '@/common/ddd';

// import { PrismaService } from './prisma.service';

// export abstract class PrismaRepository {
//   protected constructor(
//     protected readonly prisma: PrismaService,
//     protected readonly eventBus: IEventBus,
//   ) {}

//   protected async publishEvents(
//     aggregate: AggregateRoot<string>,
//   ): Promise<void> {
//     await this.eventBus.publishAll(
//       aggregate.pullDomainEvents(),
//     );
//   }
// }

import { Prisma } from '@caelix-business-os/database';

import { AggregateRoot, DomainEvent, IEventBus } from '@/common/ddd';
import { customUUID } from '@/kernel/utility/uuid';

import { PrismaService } from './prisma.service';

/**
 * Base class for every aggregate's Prisma repository.
 *
 * Provides `runInTransaction`, which is the ONLY sanctioned way to
 * persist an aggregate: it writes the aggregate's own rows AND one
 * DomainEvent (outbox) row per recorded event inside a single Prisma
 * transaction, then — only after that transaction has committed —
 * publishes the events to the in-process EventBus.
 *
 * This is what makes the Outbox Pattern actually hold: if the process
 * crashes between "aggregate write" and "event write", the whole
 * transaction rolls back, so we never end up with a persisted
 * aggregate whose event was silently dropped. If it crashes AFTER
 * commit but before publish, the DomainEvent row is still there with
 * `publishedAt: null` for a reconciliation job to pick up later.
 *
 * Individual repositories must never write outbox rows themselves —
 * always go through this method, so the atomic-write guarantee can't
 * be quietly skipped module by module.
 */
export abstract class PrismaRepository {
  protected constructor(
    protected readonly prisma: PrismaService,
    protected readonly eventBus: IEventBus,
  ) {}

  protected async runInTransaction<T>(
    aggregate: AggregateRoot<string>,
    aggregateType: string,
    work: (tx: Prisma.TransactionClient) => Promise<T>,
  ): Promise<T> {
    const events = aggregate.pullDomainEvents();

    const result = await this.prisma.client.$transaction(async (tx) => {
      const writeResult = await work(tx);

      if (events.length > 0) {
        await tx.domainEvent.createMany({
          data: events.map((event) =>
            this.toOutboxRow(aggregate.id, aggregateType, event),
          ),
        });
      }

      return writeResult;
    });

    // Post-commit dispatch. A handler failure here never rolls back the
    // write above — the DomainEvent rows remain as the durable record.
    // See OutboxService.findUnpublished for the reconciliation path.
    await this.eventBus.publishAll(events);

    return result;
  }

  private toOutboxRow(
    aggregateId: string,
    aggregateType: string,
    event: DomainEvent,
  ): Prisma.DomainEventCreateManyInput {
    return {
      id: customUUID.generate(),
      aggregateId,
      aggregateType,
      eventName: event.constructor.name,
      payload: JSON.parse(JSON.stringify(event)) as Prisma.InputJsonValue,
      occurredAt: event.occurredOn,
      publishedAt: null,
    };
  }
}
