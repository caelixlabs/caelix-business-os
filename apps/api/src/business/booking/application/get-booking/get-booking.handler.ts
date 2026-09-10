import { Inject, Injectable } from "@nestjs/common";
import { EntityNotFoundException } from "@/common/framework/exceptions";
import { BOOKING_REPOSITORY, type BookingRepository } from "../../domain/repositories";
import { GetBookingQuery } from "./get-booking.query";

@Injectable()
export class GetBookingHandler {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly repository: BookingRepository
  ) {}

  async execute(query: GetBookingQuery) {
    const booking = await this.repository.findByIdForOrganization(
      query.organizationId,
      query.bookingId
    );

    if (!booking) {
      throw new EntityNotFoundException("Booking", query.bookingId);
    }

    return booking;
  }
}
