import { Inject, Injectable } from "@nestjs/common";
import { customUUID } from "@/kernel/utility/uuid";
import { CreateBookingDto } from "../dto/create-booking.dto";
import { Booking } from "../../domain/entities/booking.entity";
import { BOOKING_REPOSITORY, type BookingRepository } from "../../domain/repositories";

@Injectable()
export class CreateBookingHandler {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly repository: BookingRepository
  ) {}

  async execute(organizationId: string, dto: CreateBookingDto): Promise<Booking> {
    const booking = Booking.create({
      id: customUUID.generate(),
      organizationId,
      branchId: dto.branchId,
      contactId: dto.contactId,
      scheduledAt: new Date(dto.scheduledAt),
      notes: dto.notes,
    });

    return this.repository.create(booking);
  }
}
