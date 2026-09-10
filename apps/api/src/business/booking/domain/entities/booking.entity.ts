import { AggregateRoot } from "@/common/ddd";
import { BookingStatus } from "../enums";
import {
  BookingCancelledEvent,
  BookingConfirmedEvent,
  BookingCreatedEvent,
} from "../events";

export interface CreateBookingProps {
  id: string;
  organizationId: string;
  branchId?: string;
  contactId: string;
  scheduledAt: Date;
  notes?: string;
}

export class Booking extends AggregateRoot<string> {
  private _scheduledAt: Date;
  private _notes?: string;
  private _status: BookingStatus;

  constructor(
    id: string,

    public readonly organizationId: string,

    public readonly branchId: string | undefined,

    public readonly contactId: string,

    scheduledAt: Date,

    notes: string | undefined,

    status: BookingStatus
  ) {
    super(id);

    this._scheduledAt = scheduledAt;
    this._notes = notes;
    this._status = status;
  }

  public static create(props: CreateBookingProps): Booking {
    if (!props.organizationId) {
      throw new Error("Organization is required.");
    }

    if (!props.contactId) {
      throw new Error("Contact is required.");
    }

    if (!(props.scheduledAt instanceof Date)) {
      throw new Error("Booking scheduled date is required.");
    }

    if (Number.isNaN(props.scheduledAt.getTime())) {
      throw new Error("Booking scheduled date is invalid.");
    }

    const booking = new Booking(
      props.id,
      props.organizationId,
      props.branchId,
      props.contactId,
      props.scheduledAt,
      props.notes?.trim(),
      BookingStatus.DRAFT
    );

    booking.addDomainEvent(
      new BookingCreatedEvent(
        booking.id,
        booking.organizationId,
        booking.contactId,
        booking.branchId
      )
    );

    return booking;
  }

  public confirm(): void {
    if (this._status !== BookingStatus.DRAFT) {
      throw new Error(
        `Only DRAFT bookings can be confirmed. Current status: ${this._status}`
      );
    }

    this._status = BookingStatus.CONFIRMED;

    this.addDomainEvent(
      new BookingConfirmedEvent(this.id, this.organizationId, this.contactId)
    );
  }

  public cancel(): void {
    if (this._status === BookingStatus.COMPLETED) {
      throw new Error("A completed booking cannot be cancelled.");
    }

    if (this._status === BookingStatus.CANCELLED) {
      return;
    }

    this._status = BookingStatus.CANCELLED;

    this.addDomainEvent(
      new BookingCancelledEvent(this.id, this.organizationId, this.contactId)
    );
  }

  public complete(): void {
    if (this._status !== BookingStatus.CONFIRMED) {
      throw new Error(
        `Only CONFIRMED bookings can be completed. Current status: ${this._status}`
      );
    }

    this._status = BookingStatus.COMPLETED;
  }

  public reschedule(scheduledAt: Date): void {
    if (
      this._status === BookingStatus.CANCELLED ||
      this._status === BookingStatus.COMPLETED
    ) {
      throw new Error("Cancelled or completed bookings cannot be rescheduled.");
    }

    if (Number.isNaN(scheduledAt.getTime())) {
      throw new Error("Booking scheduled date is invalid.");
    }

    this._scheduledAt = scheduledAt;
  }

  public updateNotes(notes?: string): void {
    this._notes = notes?.trim();
  }

  get scheduledAt(): Date {
    return this._scheduledAt;
  }

  get notes(): string | undefined {
    return this._notes;
  }

  get status(): BookingStatus {
    return this._status;
  }
}
