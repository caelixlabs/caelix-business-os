import { Module } from "@nestjs/common";
import { BOOKING_REPOSITORY } from "./domain/repositories";
import { BookingPrismaRepository } from "./infrastructure/prisma/booking.prisma.repository";
import { CreateBookingHandler } from "./application/create-booking/create-booking.handler";
import { ConfirmBookingHandler } from "./application/confirm-booking/confirm-booking.handler";
import { CancelBookingHandler } from "./application/cancel-booking/cancel-booking.handler";
import { GetBookingHandler } from "./application/get-booking/get-booking.handler";
import { ListBookingsHandler } from "./application/list-bookings/list-bookings.handler";
import { UpdateBookingHandler } from "./application/update-booking/update-booking.handler";
import { BookingController } from "./presentation/controllers/booking.controller";


@Module({
  controllers: [BookingController],

  providers: [
    {
      provide: BOOKING_REPOSITORY,
      useClass: BookingPrismaRepository,
    },
    CreateBookingHandler,
    ConfirmBookingHandler,
    CancelBookingHandler,
    GetBookingHandler,
    ListBookingsHandler,
    UpdateBookingHandler,
  ],

  exports: [
    BOOKING_REPOSITORY,
    CreateBookingHandler,
    ConfirmBookingHandler,
    CancelBookingHandler,
    GetBookingHandler,
    ListBookingsHandler,
    UpdateBookingHandler,
  ],
})
export class BookingModule {}
