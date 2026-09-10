import { Repository } from "@/common/ddd";

import { Booking } from "../entities/booking.entity";
import { BookingStatus } from "../enums";

export interface BookingRepository extends Repository<Booking> {
  findByIdForOrganization(
    organizationId: string,
    bookingId: string
  ): Promise<Booking | null>;

  findByOrganization(organizationId: string): Promise<Booking[]>;

  findByBranch(organizationId: string, branchId: string): Promise<Booking[]>;

  findByContact(organizationId: string, contactId: string): Promise<Booking[]>;

  findByStatus(
    organizationId: string,
    status: BookingStatus
  ): Promise<Booking[]>;

  findBySchedule(
    organizationId: string,
    from: Date,
    to: Date
  ): Promise<Booking[]>;
}
