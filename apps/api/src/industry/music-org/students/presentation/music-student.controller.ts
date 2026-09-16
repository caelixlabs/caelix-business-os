import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";

import { CurrentUser } from "@/core/auth/application/decorators";

import type { AccessTokenPayload } from "@/core/auth/application/services/token.service";

import { RequirePermissions } from "@/core/rbac/application/decorators";

import { RequireIndustry } from "@/core/organization/application/decorators";
import { IndustryType } from "@/core/organization/domain/enums/industry-type.enum";

import { PermissionCode } from "@/core/rbac/domain/enums";

import { assertSameOrganization } from "@/core/audit/guards/assert-same-organization";

import { MusicStudentService } from "../application/music-student.service";
import { CreateMusicStudentDto } from "../application/dto/create-music-student.dto";
import { UpdateMusicStudentDto } from "../application/dto/update-music-student.dto";
import { MusicStudentResponseDto } from "../application/dto/music-student-response.dto";

@Controller("organizations/:organizationId/music-org/students")
@RequireIndustry(IndustryType.MUSIC_ORG)
export class MusicStudentController {
  constructor(private readonly service: MusicStudentService) {}

  @Post()
  @RequirePermissions(PermissionCode.MUSIC_STUDENT_CREATE)
  async create(
    @Param("organizationId")
    organizationId: string,

    @Body()
    body: CreateMusicStudentDto,

    @CurrentUser()
    currentUser: AccessTokenPayload
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);

    const student = await this.service.create(organizationId, body);
    return MusicStudentResponseDto.fromDomain(student);
  }

  @Get()
  @RequirePermissions(PermissionCode.MUSIC_STUDENT_READ)
  async list(
    @Param("organizationId")
    organizationId: string,

    @CurrentUser()
    currentUser: AccessTokenPayload
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);

    const students = await this.service.list(organizationId);
    return MusicStudentResponseDto.fromDomainList(students);
  }

  @Get(":id")
  @RequirePermissions(PermissionCode.MUSIC_STUDENT_READ)
  async get(
    @Param("organizationId")
    organizationId: string,

    @Param("id")
    id: string,

    @CurrentUser()
    currentUser: AccessTokenPayload
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);

    const student = await this.service.get(organizationId, id);
    return MusicStudentResponseDto.fromDomain(student);
  }

  @Patch(":id")
  @RequirePermissions(PermissionCode.MUSIC_STUDENT_UPDATE)
  async update(
    @Param("organizationId")
    organizationId: string,

    @Param("id")
    id: string,

    @Body()
    body: UpdateMusicStudentDto,

    @CurrentUser()
    currentUser: AccessTokenPayload
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);

    const student = await this.service.update(organizationId, id, body);
    return MusicStudentResponseDto.fromDomain(student);
  }
}
