import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";

import { CurrentUser } from "@/core/auth/application/decorators";

import type { AccessTokenPayload } from "@/core/auth/application/services/token.service";

import { RequirePermissions } from "@/core/rbac/application/decorators";

import { PermissionCode } from "@/core/rbac/domain/enums";

import { assertSameOrganization } from "@/core/audit/guards/assert-same-organization";

import { MusicEnrollmentService } from "../application/music-enrollment.service";
import { CreateMusicEnrollmentDto } from "../application/dto/create-music-enrollment.dto";
import { UpdateMusicEnrollmentStatusDto } from "../application/dto/update-music-enrollment-status.dto";
import { MusicEnrollmentResponseDto } from "../application/dto/music-enrollment-response.dto";

@Controller("organizations/:organizationId/music-org/enrollments")
export class MusicEnrollmentController {
  constructor(private readonly service: MusicEnrollmentService) {}

  @Post()
  @RequirePermissions(PermissionCode.MUSIC_ENROLLMENT_MANAGE)
  async create(
    @Param("organizationId")
    organizationId: string,

    @Body()
    body: CreateMusicEnrollmentDto,

    @CurrentUser()
    currentUser: AccessTokenPayload
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);

    const enrollment = await this.service.create(organizationId, body);
    return MusicEnrollmentResponseDto.fromDomain(enrollment);
  }

  @Get()
  @RequirePermissions(PermissionCode.MUSIC_ENROLLMENT_READ)
  async list(
    @Param("organizationId")
    organizationId: string,

    @Query("batchId")
    batchId: string | undefined,

    @Query("studentId")
    studentId: string | undefined,

    @CurrentUser()
    currentUser: AccessTokenPayload
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);

    const enrollments = await this.service.list(organizationId, { batchId, studentId });
    return MusicEnrollmentResponseDto.fromDomainList(enrollments);
  }

  @Get(":id")
  @RequirePermissions(PermissionCode.MUSIC_ENROLLMENT_READ)
  async get(
    @Param("organizationId")
    organizationId: string,

    @Param("id")
    id: string,

    @CurrentUser()
    currentUser: AccessTokenPayload
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);

    const enrollment = await this.service.get(organizationId, id);
    return MusicEnrollmentResponseDto.fromDomain(enrollment);
  }

  @Patch(":id/status")
  @RequirePermissions(PermissionCode.MUSIC_ENROLLMENT_MANAGE)
  async updateStatus(
    @Param("organizationId")
    organizationId: string,

    @Param("id")
    id: string,

    @Body()
    body: UpdateMusicEnrollmentStatusDto,

    @CurrentUser()
    currentUser: AccessTokenPayload
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);

    const enrollment = await this.service.updateStatus(organizationId, id, body.status);
    return MusicEnrollmentResponseDto.fromDomain(enrollment);
  }
}
