import { Inject, Injectable } from "@nestjs/common";
import { EntityNotFoundException } from "@/common/framework/exceptions";
import { BOOKING_REPOSITORY, type BookingRepository } from "../../domain/repositories";

@Injectable()
export class CancelBookingHandler {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly repository: BookingRepository
  ) {}

  async execute(organizationId: string, bookingId: string) {
    const booking = await this.repository.findByIdForOrganization(
      organizationId,
      bookingId
    );

    if (!booking) {
      throw new EntityNotFoundException("Booking", bookingId);
    }

    booking.cancel();

    return this.repository.update(booking);
  }
}
