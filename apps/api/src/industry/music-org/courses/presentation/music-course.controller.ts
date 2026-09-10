import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CurrentUser } from "@/core/auth/application/decorators";
import type { AccessTokenPayload } from "@/core/auth/application/services/token.service";
import { RequirePermissions } from "@/core/rbac/application/decorators";
import { PermissionCode } from "@/core/rbac/domain/enums";
import { assertSameOrganization } from "@/core/audit/guards/assert-same-organization";
import { MusicCourseService } from "../application/music-course.service";

@Controller("organizations/:organizationId/music-org/courses")
export class MusicCourseController {
  constructor(private readonly service: MusicCourseService) {}

  @Post()
  @RequirePermissions(PermissionCode.MUSIC_COURSE_MANAGE)
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
  @RequirePermissions(PermissionCode.MUSIC_COURSE_READ)
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
