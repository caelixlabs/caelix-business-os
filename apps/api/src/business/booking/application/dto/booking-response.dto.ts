import { Booking } from "../../domain/entities/booking.entity";

export class BookingResponseDto {
  id!: string;
  organizationId!: string;
  branchId?: string;
  contactId!: string;
  scheduledAt!: Date;
  notes?: string;
  status!: string;

  static fromDomain(booking: Booking): BookingResponseDto {
    const dto = new BookingResponseDto();
    dto.id = booking.id;
    dto.organizationId = booking.organizationId;
    dto.branchId = booking.branchId;
    dto.contactId = booking.contactId;
    dto.scheduledAt = booking.scheduledAt;
    dto.notes = booking.notes;
    dto.status = booking.status;
    return dto;
  }

  static fromDomainList(bookings: Booking[]): BookingResponseDto[] {
    return bookings.map((booking) => BookingResponseDto.fromDomain(booking));
  }
}
