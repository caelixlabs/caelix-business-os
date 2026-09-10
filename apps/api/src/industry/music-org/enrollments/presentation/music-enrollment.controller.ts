import { Body, Controller, Get, Param, Post } from "@nestjs/common";

import { CurrentUser } from "@/core/auth/application/decorators";

import type { AccessTokenPayload } from "@/core/auth/application/services/token.service";

import { RequirePermissions } from "@/core/rbac/application/decorators";

import { PermissionCode } from "@/core/rbac/domain/enums";

import { assertSameOrganization } from "@/core/audit/guards/assert-same-organization";

import { MusicEnrollmentService } from "../application/music-enrollment.service";

@Controller("organizations/:organizationId/music-org/enrollments")
export class MusicEnrollmentController {
  constructor(private readonly service: MusicEnrollmentService) {}

  @Post()
  @RequirePermissions(PermissionCode.MUSIC_ENROLLMENT_MANAGE)
  create(
    @Param("organizationId")
    organizationId: string,

    @Body()
    body: any,

    @CurrentUser()
    currentUser: AccessTokenPayload
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);

    return this.service.create(organizationId, body);
  }

  @Get()
  @RequirePermissions(PermissionCode.MUSIC_ENROLLMENT_READ)
  list(
    @Param("organizationId")
    organizationId: string,

    @CurrentUser()
    currentUser: AccessTokenPayload
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);

    return this.service.list(organizationId);
  }
}
