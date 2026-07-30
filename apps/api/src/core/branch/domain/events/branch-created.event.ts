import { DomainEvent } from '@/common/ddd';

export class BranchCreatedEvent
  implements DomainEvent
{
  readonly occurredOn = new Date();

  constructor(
    public readonly branchId: string,

    public readonly organizationId: string,

    public readonly name: string,
  ) {}
}