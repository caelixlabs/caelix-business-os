import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";

import { CurrentUser } from "@/core/auth/application/decorators";

import type { AccessTokenPayload } from "@/core/auth/application/services/token.service";

import { RequirePermissions } from "@/core/rbac/application/decorators";

import { PermissionCode } from "@/core/rbac/domain/enums";

import { assertSameOrganization } from "@/core/audit/guards/assert-same-organization";

import { MusicAttendanceService } from "../application/music-attendance.service";

@Controller("organizations/:organizationId/music-org/attendance")
export class MusicAttendanceController {
  constructor(private readonly service: MusicAttendanceService) {}

  @Post()
  @RequirePermissions(PermissionCode.MUSIC_ATTENDANCE_MANAGE)
  mark(
    @Param("organizationId")
    organizationId: string,

    @Body()
    body: any,

    @CurrentUser()
    currentUser: AccessTokenPayload
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);

    return this.service.mark(organizationId, body);
  }

  @Get()
  @RequirePermissions(PermissionCode.MUSIC_ATTENDANCE_READ)
  list(
    @Param("organizationId")
    organizationId: string,

    @Query("batchId")
    batchId: string,

    @Query("date")
    date: string,

    @CurrentUser()
    currentUser: AccessTokenPayload
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);

    return this.service.list(organizationId, batchId, date);
  }
}
