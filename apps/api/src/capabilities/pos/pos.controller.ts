import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";

import { CurrentUser } from "@/core/auth/application/decorators";
import type { AccessTokenPayload } from "@/core/auth/application/services/token.service";
import { RequirePermissions } from "@/core/rbac/application/decorators";
import { PermissionCode } from "@/core/rbac/domain/enums";
import { assertSameOrganization } from "@/core/audit/guards/assert-same-organization";

import { PosService, type SaleWithLines } from "./pos.service";
import { CheckoutDto } from "./dto/checkout.dto";

@Controller("organizations/:organizationId/pos/sales")
export class PosController {
  constructor(private readonly service: PosService) {}

  @Post()
  @RequirePermissions(PermissionCode.POS_SELL)
  checkout(
    @Param("organizationId") organizationId: string,
    @Body() body: CheckoutDto,
    @CurrentUser() currentUser: AccessTokenPayload,
  ): Promise<SaleWithLines> {
    assertSameOrganization(currentUser.organizationId, organizationId);
    return this.service.checkout(organizationId, body);
  }

  @Get()
  @RequirePermissions(PermissionCode.POS_READ)
  list(
    @Param("organizationId") organizationId: string,
    @CurrentUser() currentUser: AccessTokenPayload,
  ): Promise<SaleWithLines[]> {
    assertSameOrganization(currentUser.organizationId, organizationId);
    return this.service.list(organizationId);
  }

  @Get(":id")
  @RequirePermissions(PermissionCode.POS_READ)
  get(
    @Param("organizationId") organizationId: string,
    @Param("id") id: string,
    @CurrentUser() currentUser: AccessTokenPayload,
  ): Promise<SaleWithLines> {
    assertSameOrganization(currentUser.organizationId, organizationId);
    return this.service.get(organizationId, id);
  }

  @Patch(":id/refund")
  @RequirePermissions(PermissionCode.POS_REFUND)
  refund(
    @Param("organizationId") organizationId: string,
    @Param("id") id: string,
    @CurrentUser() currentUser: AccessTokenPayload,
  ): Promise<SaleWithLines> {
    assertSameOrganization(currentUser.organizationId, organizationId);
    return this.service.refund(organizationId, id);
  }
}
