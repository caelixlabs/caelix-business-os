import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";

import { CurrentUser } from "@/core/auth/application/decorators";
import type { AccessTokenPayload } from "@/core/auth/application/services/token.service";
import { RequirePermissions } from "@/core/rbac/application/decorators";
import { RequireIndustry } from "@/core/organization/application/decorators";
import { PermissionCode } from "@/core/rbac/domain/enums";
import { IndustryType } from "@/core/organization/domain/enums/industry-type.enum";
import { assertSameOrganization } from "@/core/audit/guards/assert-same-organization";

import { GymAttendanceService } from "./gym-attendance.service";
import { MarkGymAttendanceDto } from "./dto/mark-gym-attendance.dto";

@Controller("organizations/:organizationId/gym/attendance")
@RequireIndustry(IndustryType.GYM)
export class GymAttendanceController {
  constructor(private readonly service: GymAttendanceService) {}

  @Post()
  @RequirePermissions(PermissionCode.GYM_ATTENDANCE_MANAGE)
  mark(
    @Param("organizationId") organizationId: string,
    @Body() body: MarkGymAttendanceDto,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    return this.service.mark(organizationId, body);
  }

  @Get()
  @RequirePermissions(PermissionCode.GYM_ATTENDANCE_READ)
  listByClass(
    @Param("organizationId") organizationId: string,
    @Query("classId") classId: string,
    @Query("date") date: string,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    return this.service.listByClass(organizationId, classId, date);
  }

  @Get("member/:memberId")
  @RequirePermissions(PermissionCode.GYM_ATTENDANCE_READ)
  listByMember(
    @Param("organizationId") organizationId: string,
    @Param("memberId") memberId: string,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    return this.service.listByMember(organizationId, memberId);
  }
}
