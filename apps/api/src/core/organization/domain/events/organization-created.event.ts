import { DomainEvent } from "@/common/ddd/events/interfaces";

export class OrganizationCreatedEvent implements DomainEvent {
  readonly occurredOn = new Date();

  constructor(
    public readonly organizationId: string,
    public readonly name: string,
    public readonly slug: string,
  ) {}
}