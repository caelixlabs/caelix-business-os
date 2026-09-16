import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";

import { CurrentUser } from "@/core/auth/application/decorators";
import type { AccessTokenPayload } from "@/core/auth/application/services/token.service";
import { RequirePermissions } from "@/core/rbac/application/decorators";
import { RequireIndustry } from "@/core/organization/application/decorators";
import { PermissionCode } from "@/core/rbac/domain/enums";
import { IndustryType } from "@/core/organization/domain/enums/industry-type.enum";
import { assertSameOrganization } from "@/core/audit/guards/assert-same-organization";

import { GymMemberService } from "./gym-member.service";
import { CreateGymMemberDto } from "./dto/create-gym-member.dto";
import { UpdateGymMemberDto } from "./dto/update-gym-member.dto";
import { GymMemberResponseDto } from "./dto/gym-member-response.dto";

@Controller("organizations/:organizationId/gym/members")
@RequireIndustry(IndustryType.GYM)
export class GymMemberController {
  constructor(private readonly service: GymMemberService) {}

  @Post()
  @RequirePermissions(PermissionCode.GYM_MEMBER_CREATE)
  async create(
    @Param("organizationId") organizationId: string,
    @Body() body: CreateGymMemberDto,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    const member = await this.service.create(organizationId, body);
    return GymMemberResponseDto.fromDomain(member);
  }

  @Get()
  @RequirePermissions(PermissionCode.GYM_MEMBER_READ)
  async list(
    @Param("organizationId") organizationId: string,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    const members = await this.service.list(organizationId);
    return GymMemberResponseDto.fromDomainList(members);
  }

  @Get(":id")
  @RequirePermissions(PermissionCode.GYM_MEMBER_READ)
  async get(
    @Param("organizationId") organizationId: string,
    @Param("id") id: string,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    const member = await this.service.get(organizationId, id);
    return GymMemberResponseDto.fromDomain(member);
  }

  @Patch(":id")
  @RequirePermissions(PermissionCode.GYM_MEMBER_UPDATE)
  async update(
    @Param("organizationId") organizationId: string,
    @Param("id") id: string,
    @Body() body: UpdateGymMemberDto,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    const member = await this.service.update(organizationId, id, body);
    return GymMemberResponseDto.fromDomain(member);
  }
}
