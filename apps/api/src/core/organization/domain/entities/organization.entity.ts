import { AggregateRoot } from '@/common/ddd';
import { OrganizationCreatedEvent } from '../events';
import { IndustryType } from '../enums/industry-type.enum';

export interface CreateOrganizationProps {
  id: string;
  name: string;
  slug: string;
  description?: string;
  industry: IndustryType;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateOrganizationProps {
  name?: string;
  description?: string;
}

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/**
 * Organization is the tenant boundary. Creating one raises
 * OrganizationCreatedEvent, which — via handlers registered in
 * OrganizationModule — cascades into primary-branch creation, a
 * welcome email, and an audit log entry. See application/event-handlers.
 */
export class Organization extends AggregateRoot<string> {
  private _name: string;
  private _slug: string;
  private _industry: IndustryType;
  private _description?: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(id: string, name: string, slug: string, industry: IndustryType, createdAt: Date, updatedAt: Date, description?: string) {
    super(id);
    this._name = name;
    this._slug = slug;
    this._industry = industry;
    this._description = description;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  public static create(props: CreateOrganizationProps): Organization {
    const normalizedSlug = props.slug.trim().toLowerCase();

    if (!SLUG_PATTERN.test(normalizedSlug)) {
      throw new Error(
        `"${props.slug}" is not a valid slug. Use lowercase letters, numbers, and hyphens only.`,
      );
    }

    const organization = new Organization(
      props.id,
      props.name.trim(),
      normalizedSlug,
      props.industry,
      props.createdAt,
      props.updatedAt,
      props.description?.trim(),
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

  /** Applies a partial update. Never touches slug — slugs are immutable once created. */
  public update(props: UpdateOrganizationProps): void {
    if (props.name !== undefined) {
      this._name = props.name.trim();
    }
    if (props.description !== undefined) {
      this._description = props.description.trim();
    }
    this._updatedAt = new Date();
  }

  get name(): string {
    return this._name;
  }

  get slug(): string {
    return this._slug;
  }

  get description(): string | undefined {
    return this._description;
  }

  get industry(): IndustryType {
    return this._industry;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
