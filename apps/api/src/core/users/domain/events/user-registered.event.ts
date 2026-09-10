import { DomainEvent } from '@/common/ddd';

export class UserRegisteredEvent implements DomainEvent {
  readonly occurredOn = new Date();

  constructor(
    public readonly userId: string,
    public readonly organizationId: string,
    public readonly email: string,
  ) {}
}
