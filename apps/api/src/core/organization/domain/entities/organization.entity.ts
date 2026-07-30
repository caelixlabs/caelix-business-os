import { AggregateRoot } from '@/common/ddd';
import { OrganizationCreatedEvent } from '../events';

export interface CreateOrganizationProps {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export class Organization extends AggregateRoot<string> {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly slug: string,
    public readonly description?: string,
  ) {
    super(id);
  }

   public static create(
    props: CreateOrganizationProps,
  ): Organization {
    const organization = new Organization(
      props.id,
      props.name,
      props.slug,
      props.description,
    );

    organization.addDomainEvent(
      new OrganizationCreatedEvent(
        organization.id,
        organization.name,
        organization.slug,
      ),
    );

    return organization;
  }
}