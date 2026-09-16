import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import type { MembershipPlan } from "@caelix-business-os/database";

import { CurrentUser } from "@/core/auth/application/decorators";
import type { AccessTokenPayload } from "@/core/auth/application/services/token.service";
import { RequirePermissions } from "@/core/rbac/application/decorators";
import { PermissionCode } from "@/core/rbac/domain/enums";
import { assertSameOrganization } from "@/core/audit/guards/assert-same-organization";

import { MembershipPlanService } from "./membership-plan.service";
import { CreateMembershipPlanDto } from "./dto/create-membership-plan.dto";
import { UpdateMembershipPlanDto } from "./dto/update-membership-plan.dto";

@Controller("organizations/:organizationId/membership-plans")
export class MembershipPlanController {
  constructor(private readonly service: MembershipPlanService) {}

  @Post()
  @RequirePermissions(PermissionCode.MEMBERSHIP_PLAN_MANAGE)
  create(
    @Param("organizationId") organizationId: string,
    @Body() body: CreateMembershipPlanDto,
    @CurrentUser() currentUser: AccessTokenPayload,
  ): Promise<MembershipPlan> {
    assertSameOrganization(currentUser.organizationId, organizationId);
    return this.service.create(organizationId, body);
  }

  @Get()
  @RequirePermissions(PermissionCode.MEMBERSHIP_PLAN_READ)
  list(
    @Param("organizationId") organizationId: string,
    @CurrentUser() currentUser: AccessTokenPayload,
  ): Promise<MembershipPlan[]> {
    assertSameOrganization(currentUser.organizationId, organizationId);
    return this.service.list(organizationId);
  }

  @Get(":id")
  @RequirePermissions(PermissionCode.MEMBERSHIP_PLAN_READ)
  get(
    @Param("organizationId") organizationId: string,
    @Param("id") id: string,
    @CurrentUser() currentUser: AccessTokenPayload,
  ): Promise<MembershipPlan> {
    assertSameOrganization(currentUser.organizationId, organizationId);
    return this.service.get(organizationId, id);
  }

  @Patch(":id")
  @RequirePermissions(PermissionCode.MEMBERSHIP_PLAN_MANAGE)
  update(
    @Param("organizationId") organizationId: string,
    @Param("id") id: string,
    @Body() body: UpdateMembershipPlanDto,
    @CurrentUser() currentUser: AccessTokenPayload,
  ): Promise<MembershipPlan> {
    assertSameOrganization(currentUser.organizationId, organizationId);
    return this.service.update(organizationId, id, body);
  }
}
