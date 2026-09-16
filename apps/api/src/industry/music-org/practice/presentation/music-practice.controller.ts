import { Body, Controller, Get, Param, Post } from "@nestjs/common";

import { CurrentUser } from "@/core/auth/application/decorators";

import type { AccessTokenPayload } from "@/core/auth/application/services/token.service";

import { RequirePermissions } from "@/core/rbac/application/decorators";

import { RequireIndustry } from "@/core/organization/application/decorators";
import { IndustryType } from "@/core/organization/domain/enums/industry-type.enum";

import { PermissionCode } from "@/core/rbac/domain/enums";

import { assertSameOrganization } from "@/core/audit/guards/assert-same-organization";

import { MusicPracticeService } from "../application/music-practice.service";
import { CreateMusicPracticeLogDto } from "../application/dto/create-music-practice-log.dto";
import { MusicPracticeLogResponseDto } from "../application/dto/music-practice-log-response.dto";

@Controller("organizations/:organizationId/music-org/practice")
@RequireIndustry(IndustryType.MUSIC_ORG)
export class MusicPracticeController {
  constructor(private readonly service: MusicPracticeService) {}

  @Post()
  @RequirePermissions(PermissionCode.MUSIC_PRACTICE_MANAGE)
  async create(
    @Param("organizationId")
    organizationId: string,

    @Body()
    body: CreateMusicPracticeLogDto,

    @CurrentUser()
    currentUser: AccessTokenPayload
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);

    const log = await this.service.create(organizationId, body);
    return MusicPracticeLogResponseDto.fromDomain(log);
  }

  @Get(":studentId")
  @RequirePermissions(PermissionCode.MUSIC_PRACTICE_READ)
  async list(
    @Param("organizationId")
    organizationId: string,

    @Param("studentId")
    studentId: string,

    @CurrentUser()
    currentUser: AccessTokenPayload
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);

    const logs = await this.service.list(organizationId, studentId);
    return MusicPracticeLogResponseDto.fromDomainList(logs);
  }
}
