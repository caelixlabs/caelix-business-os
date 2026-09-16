import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";

import { CurrentUser } from "@/core/auth/application/decorators";
import type { AccessTokenPayload } from "@/core/auth/application/services/token.service";
import { RequirePermissions } from "@/core/rbac/application/decorators";
import { PermissionCode } from "@/core/rbac/domain/enums";
import { assertSameOrganization } from "@/core/audit/guards/assert-same-organization";

import { MembershipSubscriptionService, type MembershipSubscriptionWithPlan } from "./membership-subscription.service";
import { SubscribeDto } from "./dto/subscribe.dto";
import { UpdateMembershipSubscriptionDto } from "./dto/update-membership-subscription.dto";

@Controller("organizations/:organizationId/membership-subscriptions")
export class MembershipSubscriptionController {
  constructor(private readonly service: MembershipSubscriptionService) {}

  @Post()
  @RequirePermissions(PermissionCode.MEMBERSHIP_SUBSCRIPTION_MANAGE)
  subscribe(
    @Param("organizationId") organizationId: string,
    @Body() body: SubscribeDto,
    @CurrentUser() currentUser: AccessTokenPayload,
  ): Promise<MembershipSubscriptionWithPlan> {
    assertSameOrganization(currentUser.organizationId, organizationId);
    return this.service.subscribe(organizationId, body);
  }

  @Get()
  @RequirePermissions(PermissionCode.MEMBERSHIP_SUBSCRIPTION_READ)
  list(
    @Param("organizationId") organizationId: string,
    @Query("contactId") contactId: string | undefined,
    @CurrentUser() currentUser: AccessTokenPayload,
  ): Promise<MembershipSubscriptionWithPlan[]> {
    assertSameOrganization(currentUser.organizationId, organizationId);
    return this.service.list(organizationId, contactId);
  }

  @Get(":id")
  @RequirePermissions(PermissionCode.MEMBERSHIP_SUBSCRIPTION_READ)
  get(
    @Param("organizationId") organizationId: string,
    @Param("id") id: string,
    @CurrentUser() currentUser: AccessTokenPayload,
  ): Promise<MembershipSubscriptionWithPlan> {
    assertSameOrganization(currentUser.organizationId, organizationId);
    return this.service.get(organizationId, id);
  }

  @Patch(":id")
  @RequirePermissions(PermissionCode.MEMBERSHIP_SUBSCRIPTION_MANAGE)
  update(
    @Param("organizationId") organizationId: string,
    @Param("id") id: string,
    @Body() body: UpdateMembershipSubscriptionDto,
    @CurrentUser() currentUser: AccessTokenPayload,
  ): Promise<MembershipSubscriptionWithPlan> {
    assertSameOrganization(currentUser.organizationId, organizationId);
    return this.service.update(organizationId, id, body);
  }
}
