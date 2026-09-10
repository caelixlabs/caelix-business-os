import { ContactStatus, ContactType } from "../enums";

export interface CreateContactProps {
  id: string;
  organizationId: string;
  branchId?: string;

  type: ContactType;

  firstName?: string;
  lastName?: string;
  companyName?: string;

  email?: string;
  phone?: string;

  notes?: string;
}

export class Contact {
  private constructor(
    private readonly props: {
      id: string;
      organizationId: string;
      branchId?: string;

      type: ContactType;
      status: ContactStatus;

      firstName?: string;
      lastName?: string;
      companyName?: string;

      email?: string;
      phone?: string;

      notes?: string;
    }
  ) {}

  static create(props: CreateContactProps): Contact {
    if (
      props.type === ContactType.PERSON &&
      !props.firstName &&
      !props.lastName
    ) {
      throw new Error("A PERSON contact must have a first name or last name.");
    }

    if (props.type === ContactType.BUSINESS && !props.companyName) {
      throw new Error("A BUSINESS contact must have a company name.");
    }

    return new Contact({
      ...props,
      status: ContactStatus.ACTIVE,
    });
  }

  get id(): string {
    return this.props.id;
  }

  get organizationId(): string {
    return this.props.organizationId;
  }

  get branchId(): string | undefined {
    return this.props.branchId;
  }

  get type(): ContactType {
    return this.props.type;
  }

  get status(): ContactStatus {
    return this.props.status;
  }

  get firstName(): string | undefined {
    return this.props.firstName;
  }

  get lastName(): string | undefined {
    return this.props.lastName;
  }

  get companyName(): string | undefined {
    return this.props.companyName;
  }

  get email(): string | undefined {
    return this.props.email;
  }

  get phone(): string | undefined {
    return this.props.phone;
  }

  get notes(): string | undefined {
    return this.props.notes;
  }

  archive(): void {
    this.props.status = ContactStatus.ARCHIVED;
  }

  activate(): void {
    this.props.status = ContactStatus.ACTIVE;
  }

  deactivate(): void {
    this.props.status = ContactStatus.INACTIVE;
  }
}
