import { BookingCancelledEvent } from "@/business/booking/domain/events/booking-cancelled.event";
import { BookingConfirmedEvent } from "@/business/booking/domain/events/booking-confirmed.event";
import { BookingCreatedEvent } from "@/business/booking/domain/events/booking-created.event";
import { EnquiryCreatedEvent } from "@/business/enquiries/domain/events/enquiry-created.event";
import { EnquiryStatusChangedEvent } from "@/business/enquiries/domain/events/enquiry-status-changed.event";
import { StockAdjustedEvent } from "@/business/inventory/domain/events/stock-adjusted.event";

export interface AutomationTrigger {
  key: string;
  label: string;
  description: string;
  event: new (...args: never[]) => object;
  /** Event fields usable in conditions and {{templates}}, beyond the contact ones. */
  variables: string[];
  /** Whether a contact can be resolved for this event (enables contactName/contactEmail). */
  hasContact: boolean;
}

export const AUTOMATION_TRIGGERS: AutomationTrigger[] = [
  {
    key: "enquiry.created",
    label: "Enquiry received",
    description: "A new enquiry is captured.",
    event: EnquiryCreatedEvent,
    variables: [],
    hasContact: true,
  },
  {
    key: "enquiry.status_changed",
    label: "Enquiry status changed",
    description: "An enquiry moves to a new pipeline stage.",
    event: EnquiryStatusChangedEvent,
    variables: ["status", "previousStatus"],
    hasContact: true,
  },
  {
    key: "booking.created",
    label: "Booking created",
    description: "A booking is placed.",
    event: BookingCreatedEvent,
    variables: [],
    hasContact: true,
  },
  {
    key: "booking.confirmed",
    label: "Booking confirmed",
    description: "A booking is confirmed.",
    event: BookingConfirmedEvent,
    variables: [],
    hasContact: true,
  },
  {
    key: "booking.cancelled",
    label: "Booking cancelled",
    description: "A booking is cancelled.",
    event: BookingCancelledEvent,
    variables: [],
    hasContact: true,
  },
  {
    key: "inventory.stock_adjusted",
    label: "Stock adjusted",
    description: "Stock on hand changes for a product.",
    event: StockAdjustedEvent,
    variables: ["quantityDelta", "quantityOnHand"],
    hasContact: false,
  },
];

export const AUTOMATION_TRIGGER_KEYS = AUTOMATION_TRIGGERS.map((trigger) => trigger.key);
