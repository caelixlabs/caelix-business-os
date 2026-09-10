import { Controller, Get, Param } from '@nestjs/common';

import { CurrentUser } from '@/core/auth/application/decorators';
import type { AccessTokenPayload } from '@/core/auth/application/services/token.service';

import { assertSameOrganization } from '@/core/audit/guards/assert-same-organization';
import { ListRolesQuery } from '../../application/list-roles/list-roles.query';
import { ListRolesHandler } from '../../application/list-roles/list-roles.hander';

@Controller()
export class RolesController {
  constructor(private readonly listRolesHandler: ListRolesHandler) {}

  @Get('organizations/:organizationId/roles')
  list(
    @Param('organizationId') organizationId: string,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    return this.listRolesHandler.execute(new ListRolesQuery(organizationId));
  }
}
