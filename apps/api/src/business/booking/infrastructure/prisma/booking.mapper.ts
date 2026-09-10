import {
  Booking as PrismaBooking,
  BookingStatus as PrismaBookingStatus,
} from "@caelix-business-os/database";

import { Booking } from "../../domain/entities/booking.entity";

import { BookingStatus } from "../../domain/enums";

export class BookingMapper {
  static toDomain(model: PrismaBooking): Booking {
    return new Booking(
      model.id,
      model.organizationId,
      model.branchId ?? undefined,
      model.contactId,
      model.scheduledAt,
      model.notes ?? undefined,
      model.status as BookingStatus
    );
  }

  static toPersistence(booking: Booking) {
    return {
      id: booking.id,
      organizationId: booking.organizationId,
      branchId: booking.branchId ?? null,
      contactId: booking.contactId,
      scheduledAt: booking.scheduledAt,
      status: booking.status as PrismaBookingStatus,
      notes: booking.notes ?? null,
    };
  }
}
