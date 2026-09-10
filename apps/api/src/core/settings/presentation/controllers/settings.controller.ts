import { Body, Controller, Get, Param, Patch } from '@nestjs/common';

import { CurrentUser } from '@/core/auth/application/decorators';
import type { AccessTokenPayload } from '@/core/auth/application/services/token.service';
import { RequirePermissions } from '@/core/rbac/application/decorators';
import { PermissionCode } from '@/core/rbac/domain/enums';

import { GetSettingsQuery } from '../../application/get-settings/get-settings.query';
import { GetSettingsHandler } from '../../application/get-settings/get-settings.handler';
import { UpdateSettingsDto } from '../../application/update-settings/update-settings.dto';
import { UpdateSettingsCommand } from '../../application/update-settings/update-settings.command';
import { UpdateSettingsHandler } from '../../application/update-settings/update-settings.handler';
import { assertSameOrganization } from '@/core/audit/guards/assert-same-organization';

@Controller()
export class SettingsController {
  constructor(
    private readonly getSettingsHandler: GetSettingsHandler,
    private readonly updateSettingsHandler: UpdateSettingsHandler,
  ) {}

  @Get('organizations/:organizationId/settings')
  @RequirePermissions(PermissionCode.ORGANIZATION_READ)
  get(
    @Param('organizationId') organizationId: string,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    return this.getSettingsHandler.execute(new GetSettingsQuery(organizationId));
  }

  @Patch('organizations/:organizationId/settings')
  @RequirePermissions(PermissionCode.ORGANIZATION_UPDATE)
  update(
    @Param('organizationId') organizationId: string,
    @Body() dto: UpdateSettingsDto,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    return this.updateSettingsHandler.execute(new UpdateSettingsCommand(organizationId, dto));
  }
}