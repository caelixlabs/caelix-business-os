import { AggregateRoot } from "@/common/ddd";

import { EnquirySource, EnquiryStatus } from "../enums";

import { EnquiryCreatedEvent, EnquiryStatusChangedEvent } from "../events";

export interface CreateEnquiryProps {
  id: string;
  organizationId: string;
  branchId?: string;
  contactId: string;
  assignedUserId?: string;
  source: EnquirySource;
  subject: string;
  description?: string;
}

export class Enquiry extends AggregateRoot<string> {
  private _status: EnquiryStatus;

  private _subject: string;

  private _description?: string;

  private _assignedUserId?: string;

  constructor(
    id: string,

    public readonly organizationId: string,

    public readonly branchId: string | undefined,

    public readonly contactId: string,

    assignedUserId: string | undefined,

    public readonly source: EnquirySource,

    subject: string,

    description: string | undefined,

    status: EnquiryStatus
  ) {
    super(id);

    this._assignedUserId = assignedUserId;

    this._subject = subject;

    this._description = description;

    this._status = status;
  }

  public static create(props: CreateEnquiryProps): Enquiry {
    const subject = props.subject.trim();

    if (!subject) {
      throw new Error("Enquiry subject is required.");
    }

    const enquiry = new Enquiry(
      props.id,
      props.organizationId,
      props.branchId,
      props.contactId,
      props.assignedUserId,
      props.source,
      subject,
      props.description?.trim(),
      EnquiryStatus.NEW
    );

    enquiry.addDomainEvent(
      new EnquiryCreatedEvent(
        enquiry.id,
        enquiry.organizationId,
        enquiry.contactId,
        enquiry.branchId
      )
    );

    return enquiry;
  }

  public contact(): void {
    this.changeStatus(EnquiryStatus.CONTACTED);
  }

  public qualify(): void {
    if (this._status !== EnquiryStatus.CONTACTED) {
      throw new Error("Only contacted enquiries can be qualified.");
    }

    this.changeStatus(EnquiryStatus.QUALIFIED);
  }

  public convert(): void {
    if (
      this._status !== EnquiryStatus.QUALIFIED &&
      this._status !== EnquiryStatus.CONTACTED
    ) {
      throw new Error(
        "Only contacted or qualified enquiries can be converted."
      );
    }

    this.changeStatus(EnquiryStatus.CONVERTED);
  }

  public lose(): void {
    if (this._status === EnquiryStatus.CONVERTED) {
      throw new Error("A converted enquiry cannot be marked as lost.");
    }

    this.changeStatus(EnquiryStatus.LOST);
  }

  public assignTo(userId: string): void {
    this._assignedUserId = userId;
  }

  public updateDetails(props: {
    subject?: string;
    description?: string;
  }): void {
    if (props.subject !== undefined) {
      const subject = props.subject.trim();

      if (!subject) {
        throw new Error("Enquiry subject is required.");
      }

      this._subject = subject;
    }

    if (props.description !== undefined) {
      this._description = props.description.trim();
    }
  }

  private changeStatus(status: EnquiryStatus): void {
    const previousStatus = this._status;

    if (previousStatus === status) {
      return;
    }

    this._status = status;

    this.addDomainEvent(
      new EnquiryStatusChangedEvent(
        this.id,
        this.organizationId,
        previousStatus,
        status
      )
    );
  }

  get status(): EnquiryStatus {
    return this._status;
  }

  get subject(): string {
    return this._subject;
  }

  get description(): string | undefined {
    return this._description;
  }

  get assignedUserId(): string | undefined {
    return this._assignedUserId;
  }
}
