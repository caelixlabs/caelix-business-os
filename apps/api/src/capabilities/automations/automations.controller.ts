import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from "@nestjs/common";
import type { AutomationRule } from "@caelix-business-os/database";

import { CurrentUser } from "@/core/auth/application/decorators";
import type { AccessTokenPayload } from "@/core/auth/application/services/token.service";
import { RequirePermissions } from "@/core/rbac/application/decorators";
import { PermissionCode } from "@/core/rbac/domain/enums";
import { assertSameOrganization } from "@/core/audit/guards/assert-same-organization";

import { AUTOMATION_TRIGGERS } from "./automation-triggers";
import { AutomationsService } from "./automations.service";
import { CreateAutomationRuleDto, UpdateAutomationRuleDto } from "./dto/automation-rule.dto";

@Controller("organizations/:organizationId/automations")
export class AutomationsController {
  constructor(private readonly service: AutomationsService) {}

  @Get("triggers")
  @RequirePermissions(PermissionCode.AUTOMATION_READ)
  triggers() {
    return AUTOMATION_TRIGGERS.map(({ key, label, description, variables, hasContact }) => ({
      key,
      label,
      description,
      variables: hasContact ? [...variables, "contactName", "contactEmail"] : variables,
      canEmailContact: hasContact,
    }));
  }

  @Get()
  @RequirePermissions(PermissionCode.AUTOMATION_READ)
  list(
    @Param("organizationId") organizationId: string,
    @CurrentUser() currentUser: AccessTokenPayload,
  ): Promise<AutomationRule[]> {
    assertSameOrganization(currentUser.organizationId, organizationId);
    return this.service.list(organizationId);
  }

  @Post()
  @RequirePermissions(PermissionCode.AUTOMATION_MANAGE)
  create(
    @Param("organizationId") organizationId: string,
    @Body() body: CreateAutomationRuleDto,
    @CurrentUser() currentUser: AccessTokenPayload,
  ): Promise<AutomationRule> {
    assertSameOrganization(currentUser.organizationId, organizationId);
    return this.service.create(organizationId, body);
  }

  @Patch(":id")
  @RequirePermissions(PermissionCode.AUTOMATION_MANAGE)
  update(
    @Param("organizationId") organizationId: string,
    @Param("id") id: string,
    @Body() body: UpdateAutomationRuleDto,
    @CurrentUser() currentUser: AccessTokenPayload,
  ): Promise<AutomationRule> {
    assertSameOrganization(currentUser.organizationId, organizationId);
    return this.service.update(organizationId, id, body);
  }

  @Delete(":id")
  @HttpCode(204)
  @RequirePermissions(PermissionCode.AUTOMATION_MANAGE)
  async remove(
    @Param("organizationId") organizationId: string,
    @Param("id") id: string,
    @CurrentUser() currentUser: AccessTokenPayload,
  ): Promise<void> {
    assertSameOrganization(currentUser.organizationId, organizationId);
    await this.service.remove(organizationId, id);
  }
}
