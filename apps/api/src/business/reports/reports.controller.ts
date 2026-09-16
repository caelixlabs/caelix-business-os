import { Controller, Get, Param } from "@nestjs/common";

import { CurrentUser } from "@/core/auth/application/decorators";
import type { AccessTokenPayload } from "@/core/auth/application/services/token.service";
import { RequirePermissions } from "@/core/rbac/application/decorators";
import { PermissionCode } from "@/core/rbac/domain/enums";
import { assertSameOrganization } from "@/core/audit/guards/assert-same-organization";

import { ReportsService } from "./reports.service";

@Controller("organizations/:organizationId/reports")
export class ReportsController {
  constructor(private readonly service: ReportsService) {}

  @Get("overview")
  @RequirePermissions(PermissionCode.REPORT_READ)
  async overview(
    @Param("organizationId") organizationId: string,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    return this.service.getOverview(organizationId);
  }
}
