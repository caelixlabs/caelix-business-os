import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";

import { CurrentUser } from "@/core/auth/application/decorators";

import type { AccessTokenPayload } from "@/core/auth/application/services/token.service";

import { RequirePermissions } from "@/core/rbac/application/decorators";

import { PermissionCode } from "@/core/rbac/domain/enums";

import { assertSameOrganization } from "@/core/audit/guards/assert-same-organization";

import { MusicAttendanceService } from "../application/music-attendance.service";
import { MarkMusicAttendanceDto } from "../application/dto/mark-music-attendance.dto";
import { MusicAttendanceResponseDto } from "../application/dto/music-attendance-response.dto";

@Controller("organizations/:organizationId/music-org/attendance")
export class MusicAttendanceController {
  constructor(private readonly service: MusicAttendanceService) {}

  @Post()
  @RequirePermissions(PermissionCode.MUSIC_ATTENDANCE_MANAGE)
  async mark(
    @Param("organizationId")
    organizationId: string,

    @Body()
    body: MarkMusicAttendanceDto,

    @CurrentUser()
    currentUser: AccessTokenPayload
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);

    const attendance = await this.service.mark(organizationId, body);
    return MusicAttendanceResponseDto.fromDomain(attendance);
  }

  @Get()
  @RequirePermissions(PermissionCode.MUSIC_ATTENDANCE_READ)
  async list(
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

    const records = await this.service.list(organizationId, batchId, date);
    return MusicAttendanceResponseDto.fromDomainList(records);
  }

  @Get("by-student/:studentId")
  @RequirePermissions(PermissionCode.MUSIC_ATTENDANCE_READ)
  async listByStudent(
    @Param("organizationId")
    organizationId: string,

    @Param("studentId")
    studentId: string,

    @CurrentUser()
    currentUser: AccessTokenPayload
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);

    const records = await this.service.listByStudent(organizationId, studentId);
    return MusicAttendanceResponseDto.fromDomainList(records);
  }
}
