import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { CurrentUser } from "@/core/auth/application/decorators";
import type { AccessTokenPayload } from "@/core/auth/application/services/token.service";
import { RequirePermissions } from "@/core/rbac/application/decorators";

import { RequireIndustry } from "@/core/organization/application/decorators";
import { IndustryType } from "@/core/organization/domain/enums/industry-type.enum";
import { PermissionCode } from "@/core/rbac/domain/enums";
import { assertSameOrganization } from "@/core/audit/guards/assert-same-organization";
import { MusicCourseService } from "../application/music-course.service";
import { CreateMusicCourseDto } from "../application/dto/create-music-course.dto";
import { UpdateMusicCourseDto } from "../application/dto/update-music-course.dto";
import { MusicCourseResponseDto } from "../application/dto/music-course-response.dto";

@Controller("organizations/:organizationId/music-org/courses")
@RequireIndustry(IndustryType.MUSIC_ORG)
export class MusicCourseController {
  constructor(private readonly service: MusicCourseService) {}

  @Post()
  @RequirePermissions(PermissionCode.MUSIC_COURSE_MANAGE)
  async create(
    @Param("organizationId")
    organizationId: string,

    @Body()
    body: CreateMusicCourseDto,

    @CurrentUser()
    currentUser: AccessTokenPayload
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);

    const course = await this.service.create(organizationId, body);
    return MusicCourseResponseDto.fromDomain(course);
  }

  @Get()
  @RequirePermissions(PermissionCode.MUSIC_COURSE_READ)
  async list(
    @Param("organizationId")
    organizationId: string,

    @CurrentUser()
    currentUser: AccessTokenPayload
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);

    const courses = await this.service.list(organizationId);
    return MusicCourseResponseDto.fromDomainList(courses);
  }

  @Get(":id")
  @RequirePermissions(PermissionCode.MUSIC_COURSE_READ)
  async get(
    @Param("organizationId")
    organizationId: string,

    @Param("id")
    id: string,

    @CurrentUser()
    currentUser: AccessTokenPayload
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);

    const course = await this.service.get(organizationId, id);
    return MusicCourseResponseDto.fromDomain(course);
  }

  @Patch(":id")
  @RequirePermissions(PermissionCode.MUSIC_COURSE_MANAGE)
  async update(
    @Param("organizationId")
    organizationId: string,

    @Param("id")
    id: string,

    @Body()
    body: UpdateMusicCourseDto,

    @CurrentUser()
    currentUser: AccessTokenPayload
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);

    const course = await this.service.update(organizationId, id, body);
    return MusicCourseResponseDto.fromDomain(course);
  }
}
