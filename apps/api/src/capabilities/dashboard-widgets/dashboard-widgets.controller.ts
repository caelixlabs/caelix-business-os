import { Body, Controller, Get, Param, Patch } from "@nestjs/common";

import { CurrentUser } from "@/core/auth/application/decorators";
import type { AccessTokenPayload } from "@/core/auth/application/services/token.service";
import { RequirePermissions } from "@/core/rbac/application/decorators";
import { PermissionCode } from "@/core/rbac/domain/enums";
import { assertSameOrganization } from "@/core/audit/guards/assert-same-organization";

import { DashboardWidgetsService } from "./dashboard-widgets.service";
import { UpdateDashboardWidgetsDto } from "./dto/update-dashboard-widgets.dto";

@Controller("organizations/:organizationId/dashboard-widgets")
export class DashboardWidgetsController {
  constructor(private readonly service: DashboardWidgetsService) {}

  @Get()
  @RequirePermissions(PermissionCode.ORGANIZATION_READ)
  get(
    @Param("organizationId") organizationId: string,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    return this.service.get(organizationId);
  }

  @Patch()
  @RequirePermissions(PermissionCode.ORGANIZATION_UPDATE)
  update(
    @Param("organizationId") organizationId: string,
    @Body() body: UpdateDashboardWidgetsDto,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    return this.service.update(organizationId, body.widgets);
  }
}
