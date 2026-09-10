import { Inject, Injectable } from "@nestjs/common";
import { BOOKING_REPOSITORY, type BookingRepository } from "../../domain/repositories";
import { ListBookingsQuery } from "./list-bookings.query";
import { BookingStatus } from "../../domain/enums";

@Injectable()
export class ListBookingsHandler {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly repository: BookingRepository
  ) {}

  async execute(query: ListBookingsQuery) {
    if (query.from && query.to) {
      return this.repository.findBySchedule(
        query.organizationId,
        query.from,
        query.to
      );
    }

    if (query.branchId) {
      return this.repository.findByBranch(query.organizationId, query.branchId);
    }

    if (query.contactId) {
      return this.repository.findByContact(
        query.organizationId,
        query.contactId
      );
    }

    if (query.status) {
      return this.repository.findByStatus(
        query.organizationId,
        query.status as BookingStatus
      );
    }

    return this.repository.findByOrganization(query.organizationId);
  }
}
