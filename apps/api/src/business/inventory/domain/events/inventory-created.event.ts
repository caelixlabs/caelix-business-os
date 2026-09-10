import {
  DomainEvent,
} from '@/common/ddd';

export class InventoryCreatedEvent
  implements DomainEvent
{
  readonly occurredOn: Date;

  constructor(
    public readonly inventoryId: string,

    public readonly organizationId: string,

    public readonly branchId: string,

    public readonly productId: string,
  ) {
    this.occurredOn =
      new Date();
  }
}