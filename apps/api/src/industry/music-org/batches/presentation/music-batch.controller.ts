import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";

import { CurrentUser } from "@/core/auth/application/decorators";

import type { AccessTokenPayload } from "@/core/auth/application/services/token.service";

import { RequirePermissions } from "@/core/rbac/application/decorators";

import { PermissionCode } from "@/core/rbac/domain/enums";

import { assertSameOrganization } from "@/core/audit/guards/assert-same-organization";

import { MusicBatchService } from "../application/music-batch.service";
import { CreateMusicBatchDto } from "../application/dto/create-music-batch.dto";
import { UpdateMusicBatchDto } from "../application/dto/update-music-batch.dto";
import { MusicBatchResponseDto } from "../application/dto/music-batch-response.dto";

@Controller("organizations/:organizationId/music-org/batches")
export class MusicBatchController {
  constructor(private readonly service: MusicBatchService) {}

  @Post()
  @RequirePermissions(PermissionCode.MUSIC_BATCH_MANAGE)
  async create(
    @Param("organizationId")
    organizationId: string,

    @Body()
    body: CreateMusicBatchDto,

    @CurrentUser()
    currentUser: AccessTokenPayload
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);

    const batch = await this.service.create(organizationId, body);
    return MusicBatchResponseDto.fromDomain(batch);
  }

  @Get()
  @RequirePermissions(PermissionCode.MUSIC_BATCH_READ)
  async list(
    @Param("organizationId")
    organizationId: string,

    @Query("courseId")
    courseId: string | undefined,

    @Query("teacherUserId")
    teacherUserId: string | undefined,

    @CurrentUser()
    currentUser: AccessTokenPayload
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);

    const batches = await this.service.list(organizationId, { courseId, teacherUserId });
    return MusicBatchResponseDto.fromDomainList(batches);
  }

  @Get(":id")
  @RequirePermissions(PermissionCode.MUSIC_BATCH_READ)
  async get(
    @Param("organizationId")
    organizationId: string,

    @Param("id")
    id: string,

    @CurrentUser()
    currentUser: AccessTokenPayload
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);

    const batch = await this.service.get(organizationId, id);
    return MusicBatchResponseDto.fromDomain(batch);
  }

  @Patch(":id")
  @RequirePermissions(PermissionCode.MUSIC_BATCH_MANAGE)
  async update(
    @Param("organizationId")
    organizationId: string,

    @Param("id")
    id: string,

    @Body()
    body: UpdateMusicBatchDto,

    @CurrentUser()
    currentUser: AccessTokenPayload
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);

    const batch = await this.service.update(organizationId, id, body);
    return MusicBatchResponseDto.fromDomain(batch);
  }
}
