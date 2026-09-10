import { Repository } from '@/common/ddd';

import { StoredDomainEvent } from '../entites';
export interface DomainEventRepository extends Repository<StoredDomainEvent> {
  findUnpublished(): Promise<StoredDomainEvent[]>;
}
