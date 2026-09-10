import { DomainEvent } from "@/common/ddd";

import { EnquiryStatus } from "../enums";

export class EnquiryStatusChangedEvent implements DomainEvent {
  readonly occurredOn: Date;

  constructor(
    public readonly enquiryId: string,
    public readonly organizationId: string,
    public readonly previousStatus: EnquiryStatus,
    public readonly status: EnquiryStatus
  ) {
    this.occurredOn = new Date();
  }
}
