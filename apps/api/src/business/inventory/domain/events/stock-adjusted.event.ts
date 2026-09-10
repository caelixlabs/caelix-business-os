import {
  DomainEvent,
} from '@/common/ddd';

export class StockAdjustedEvent
  implements DomainEvent
{
  readonly occurredOn: Date;

  constructor(
    public readonly inventoryId: string,

    public readonly organizationId: string,

    public readonly branchId: string,

    public readonly productId: string,

    public readonly quantityDelta: number,

    public readonly quantityOnHand: number,
  ) {
    this.occurredOn =
      new Date();
  }
}