import { Controller, Get, Param } from "@nestjs/common";

import { CurrentUser } from "@/core/auth/application/decorators";
import type { AccessTokenPayload } from "@/core/auth/application/services/token.service";
import { RequirePermissions } from "@/core/rbac/application/decorators";
import { RequireIndustry } from "@/core/organization/application/decorators";
import { PermissionCode } from "@/core/rbac/domain/enums";
import { IndustryType } from "@/core/organization/domain/enums/industry-type.enum";
import { assertSameOrganization } from "@/core/audit/guards/assert-same-organization";

import { GymDashboardService } from "./gym-dashboard.service";

@Controller("organizations/:organizationId/gym/dashboard")
@RequireIndustry(IndustryType.GYM)
export class GymDashboardController {
  constructor(private readonly service: GymDashboardService) {}

  @Get("overview")
  @RequirePermissions(PermissionCode.REPORT_READ)
  overview(
    @Param("organizationId") organizationId: string,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    return this.service.getOverview(organizationId);
  }
}
