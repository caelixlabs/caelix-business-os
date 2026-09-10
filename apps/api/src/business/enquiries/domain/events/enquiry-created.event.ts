import { DomainEvent } from "@/common/ddd";

export class EnquiryCreatedEvent implements DomainEvent {
  readonly occurredOn: Date;

  constructor(
    public readonly enquiryId: string,
    public readonly organizationId: string,
    public readonly contactId: string,
    public readonly branchId: string | undefined
  ) {
    this.occurredOn = new Date();
  }
}
