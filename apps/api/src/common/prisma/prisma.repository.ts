import { AggregateRoot, IEventBus } from '@/common/ddd';

import { PrismaService } from './prisma.service';

export abstract class PrismaRepository {
  protected constructor(
    protected readonly prisma: PrismaService,
    protected readonly eventBus: IEventBus,
  ) {}

  protected async publishEvents(
    aggregate: AggregateRoot<string>,
  ): Promise<void> {
    await this.eventBus.publishAll(
      aggregate.pullDomainEvents(),
    );
  }
}