import { Body, Controller, Get, Param, Post } from "@nestjs/common";

import { CurrentUser } from "@/core/auth/application/decorators";

import type { AccessTokenPayload } from "@/core/auth/application/services/token.service";

import { RequirePermissions } from "@/core/rbac/application/decorators";

import { PermissionCode } from "@/core/rbac/domain/enums";

import { assertSameOrganization } from "@/core/audit/guards/assert-same-organization";

import { MusicPracticeService } from "../application/music-practice.service";

@Controller("organizations/:organizationId/music-org/practice")
export class MusicPracticeController {
  constructor(private readonly service: MusicPracticeService) {}

  @Post()
  @RequirePermissions(PermissionCode.MUSIC_PRACTICE_MANAGE)
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

  @Get(":studentId")
  @RequirePermissions(PermissionCode.MUSIC_PRACTICE_READ)
  list(
    @Param("organizationId")
    organizationId: string,

    @Param("studentId")
    studentId: string,

    @CurrentUser()
    currentUser: AccessTokenPayload
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);

    return this.service.list(organizationId, studentId);
  }
}
