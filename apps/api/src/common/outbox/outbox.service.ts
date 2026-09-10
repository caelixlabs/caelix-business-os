import { Inject, Injectable } from '@nestjs/common';

import {
  DOMAIN_EVENT_REPOSITORY,
  type DomainEventRepository,
  StoredDomainEvent,
} from './domain';

@Injectable()
export class OutboxService {
  constructor(
    @Inject(DOMAIN_EVENT_REPOSITORY)
    private readonly repository: DomainEventRepository,
  ) {}

  async save(event: StoredDomainEvent): Promise<void> {
    await this.repository.create(event);
  }

  async saveMany(events: StoredDomainEvent[]): Promise<void> {
    for (const event of events) {
      await this.repository.create(event);
    }
  }
}
