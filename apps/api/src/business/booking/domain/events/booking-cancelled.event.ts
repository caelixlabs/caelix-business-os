import { DomainEvent } from "@/common/ddd";

export class BookingCancelledEvent implements DomainEvent {
  readonly occurredOn: Date;

  constructor(
    public readonly bookingId: string,
    public readonly organizationId: string,
    public readonly contactId: string
  ) {
    this.occurredOn = new Date();
  }
}
