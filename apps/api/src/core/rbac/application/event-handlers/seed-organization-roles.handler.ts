import { Injectable, Logger } from '@nestjs/common';

import { EventHandler, IEventHandler } from '@/common/ddd';
import { PrismaService } from '@/common/prisma';
import { customUUID } from '@/kernel/utility/uuid';

import { OrganizationCreatedEvent } from '@/core/organization/domain/events';
import { RoleLevel } from '../../domain/enums';
import { ROLE_PERMISSION_MATRIX } from '../../domain/role-permission-matrix';

/**
 * Reacts to OrganizationCreatedEvent by seeding the five fixed system
 * roles (OWNER, ADMIN, MANAGER, EMPLOYEE, VIEWER) for the new
 * organization, each pre-wired to its baseline permission set. Every
 * permission referenced by ROLE_PERMISSION_MATRIX must already exist
 * globally — see prisma/seed.ts, which seeds the Permission catalogue
 * once at deploy time (permissions are not per-organization).
 */
@Injectable()
@EventHandler(OrganizationCreatedEvent)
export class SeedOrganizationRolesHandler implements IEventHandler<OrganizationCreatedEvent> {
  private readonly logger = new Logger(SeedOrganizationRolesHandler.name);

  constructor(private readonly prisma: PrismaService) {}

  async handle(event: OrganizationCreatedEvent): Promise<void> {
    const permissions = await this.prisma.client.permission.findMany();
    const permissionIdByCode = new Map(
      permissions.map((permission: { code: string; id: string }) => [
        permission.code,
        permission.id,
      ]),
    );

    for (const level of Object.values(RoleLevel)) {
      const role = await this.prisma.client.role.create({
        data: {
          id: customUUID.generate(),
          organizationId: event.organizationId,
          name: level,
          level,
          isSystem: true,
        },
      });

      const grantedCodes = ROLE_PERMISSION_MATRIX[level] ?? [];
      const rolePermissionRows = grantedCodes
        .map((code) => permissionIdByCode.get(code))
        .filter((id): id is string => Boolean(id))
        .map((permissionId) => ({ roleId: role.id, permissionId }));

      if (rolePermissionRows.length > 0) {
        await this.prisma.client.rolePermission.createMany({
          data: rolePermissionRows,
        });
      }
    }

    this.logger.log(
      `Seeded system roles for organization ${event.organizationId}`,
    );
  }
}
