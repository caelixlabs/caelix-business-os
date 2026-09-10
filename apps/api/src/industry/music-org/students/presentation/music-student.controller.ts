import { Body, Controller, Get, Param, Post } from "@nestjs/common";

import { CurrentUser } from "@/core/auth/application/decorators";

import type { AccessTokenPayload } from "@/core/auth/application/services/token.service";

import { RequirePermissions } from "@/core/rbac/application/decorators";

import { PermissionCode } from "@/core/rbac/domain/enums";

import { assertSameOrganization } from "@/core/audit/guards/assert-same-organization";

import { MusicStudentService } from "../application/music-student.service";

@Controller("organizations/:organizationId/music-org/students")
export class MusicStudentController {
  constructor(private readonly service: MusicStudentService) {}

  @Post()
  @RequirePermissions(PermissionCode.MUSIC_STUDENT_CREATE)
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
  @RequirePermissions(PermissionCode.MUSIC_STUDENT_READ)
  list(
    @Param("organizationId")
    organizationId: string,

    @CurrentUser()
    currentUser: AccessTokenPayload
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);

    return this.service.list(organizationId);
  }

  @Get(":id")
  @RequirePermissions(PermissionCode.MUSIC_STUDENT_READ)
  get(
    @Param("organizationId")
    organizationId: string,

    @Param("id")
    id: string,

    @CurrentUser()
    currentUser: AccessTokenPayload
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);

    return this.service.get(organizationId, id);
  }
}
