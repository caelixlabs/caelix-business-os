import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";

import { CurrentUser } from "@/core/auth/application/decorators";
import type { AccessTokenPayload } from "@/core/auth/application/services/token.service";
import { RequirePermissions } from "@/core/rbac/application/decorators";
import { PermissionCode } from "@/core/rbac/domain/enums";
import { assertSameOrganization } from "@/core/audit/guards/assert-same-organization";

import { CreateBookingHandler } from "../../application/create-booking/create-booking.handler";
import { CreateBookingDto } from "../../application/dto/create-booking.dto";
import { GetBookingHandler } from "../../application/get-booking/get-booking.handler";
import { ListBookingsHandler } from "../../application/list-bookings/list-bookings.handler";
import { UpdateBookingHandler } from "../../application/update-booking/update-booking.handler";
import { UpdateBookingDto } from "../../application/update-booking/update-booking.dto";
import { ConfirmBookingHandler } from "../../application/confirm-booking/confirm-booking.handler";
import { CancelBookingHandler } from "../../application/cancel-booking/cancel-booking.handler";
import { BookingResponseDto } from "../../application/dto/booking-response.dto";

@Controller("organizations/:organizationId/bookings")
export class BookingController {
  constructor(
    private readonly createBookingHandler: CreateBookingHandler,
    private readonly getBookingHandler: GetBookingHandler,
    private readonly listBookingsHandler: ListBookingsHandler,
    private readonly updateBookingHandler: UpdateBookingHandler,
    private readonly confirmBookingHandler: ConfirmBookingHandler,
    private readonly cancelBookingHandler: CancelBookingHandler,
  ) {}

  @Post()
  @RequirePermissions(PermissionCode.BOOKING_CREATE)
  async create(
    @Param("organizationId") organizationId: string,
    @Body() dto: CreateBookingDto,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    const booking = await this.createBookingHandler.execute(organizationId, dto);
    return BookingResponseDto.fromDomain(booking);
  }

  @Get()
  @RequirePermissions(PermissionCode.BOOKING_READ)
  async list(
    @Param("organizationId") organizationId: string,
    @Query("branchId") branchId: string | undefined,
    @Query("contactId") contactId: string | undefined,
    @Query("status") status: string | undefined,
    @Query("from") from: string | undefined,
    @Query("to") to: string | undefined,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    const bookings = await this.listBookingsHandler.execute({
      organizationId,
      branchId,
      contactId,
      status,
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
    });
    return BookingResponseDto.fromDomainList(bookings);
  }

  @Get(":id")
  @RequirePermissions(PermissionCode.BOOKING_READ)
  async get(
    @Param("organizationId") organizationId: string,
    @Param("id") id: string,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    const booking = await this.getBookingHandler.execute({ organizationId, bookingId: id });
    return BookingResponseDto.fromDomain(booking);
  }

  @Patch(":id")
  @RequirePermissions(PermissionCode.BOOKING_MANAGE)
  async update(
    @Param("organizationId") organizationId: string,
    @Param("id") id: string,
    @Body() dto: UpdateBookingDto,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    const booking = await this.updateBookingHandler.execute(organizationId, id, dto);
    return BookingResponseDto.fromDomain(booking);
  }

  @Patch(":id/confirm")
  @RequirePermissions(PermissionCode.BOOKING_MANAGE)
  async confirm(
    @Param("organizationId") organizationId: string,
    @Param("id") id: string,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    const booking = await this.confirmBookingHandler.execute(organizationId, id);
    return BookingResponseDto.fromDomain(booking);
  }

  @Patch(":id/cancel")
  @RequirePermissions(PermissionCode.BOOKING_MANAGE)
  async cancel(
    @Param("organizationId") organizationId: string,
    @Param("id") id: string,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    const booking = await this.cancelBookingHandler.execute(organizationId, id);
    return BookingResponseDto.fromDomain(booking);
  }
}
