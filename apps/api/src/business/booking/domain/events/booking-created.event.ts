import { DomainEvent } from "@/common/ddd";

export class BookingCreatedEvent implements DomainEvent {
  readonly occurredOn: Date;

  constructor(
    public readonly bookingId: string,
    public readonly organizationId: string,
    public readonly contactId: string,
    public readonly branchId?: string
  ) {
    this.occurredOn = new Date();
  }
}
