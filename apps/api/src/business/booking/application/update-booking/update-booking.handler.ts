import { Inject, Injectable } from "@nestjs/common";

import { EntityNotFoundException } from "@/common/framework/exceptions";

import { BOOKING_REPOSITORY, type BookingRepository } from "../../domain/repositories";

import { UpdateBookingDto } from "./update-booking.dto";

@Injectable()
export class UpdateBookingHandler {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly repository: BookingRepository
  ) {}

  async execute(organizationId: string, bookingId: string, dto: UpdateBookingDto) {
    const booking = await this.repository.findByIdForOrganization(organizationId, bookingId);

    if (!booking) {
      throw new EntityNotFoundException("Booking", bookingId);
    }

    if (dto.scheduledAt) {
      booking.reschedule(new Date(dto.scheduledAt));
    }

    if (dto.notes !== undefined) {
      booking.updateNotes(dto.notes);
    }

    return this.repository.update(booking);
  }
}
