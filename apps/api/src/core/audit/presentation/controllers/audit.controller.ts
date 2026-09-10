import { Controller, Get, Param, Query } from '@nestjs/common';

import { RequirePermissions } from '@/core/rbac/application/decorators';
import { PermissionCode } from '@/core/rbac/domain/enums';
import type { AccessTokenPayload } from '@/core/auth/application/services/token.service';

import { GetAuditLogHandler } from '../../application/get-audit-log/get-audit-log.handler';
import { GetAuditLogQuery } from '../../application/get-audit-log/get-audit-log.query';
import { CurrentUser } from '@/core/auth/application/decorators';
import { assertSameOrganization } from '../../guards/assert-same-organization';

@Controller()
export class AuditController {
  constructor(private readonly getAuditLogHandler: GetAuditLogHandler) { }

  @Get('organizations/:organizationId/audit-log')
  @RequirePermissions(PermissionCode.ORGANIZATION_READ)
  list(
    @Param('organizationId') organizationId: string,
    @CurrentUser() currentUser: AccessTokenPayload,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('action') action?: string,
    @Query('entityType') entityType?: string,
    @Query('actorUserId') actorUserId?: string,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    return this.getAuditLogHandler.execute(
      new GetAuditLogQuery(
        organizationId,
        Number(page) || 1,
        Number(limit) || 20,
        {
          action,
          entityType,
          actorUserId,
        },
      )
    );
  }
}
