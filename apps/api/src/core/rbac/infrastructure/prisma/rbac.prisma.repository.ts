import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@/common/prisma';

import {
  EffectiveAccess,
  RbacRepository,
  RoleSummary,
} from '../../domain/repositories/rbac.repository';
import { RoleLevel } from '../../domain/enums';

@Injectable()
export class RbacPrismaRepository implements RbacRepository {
  constructor(private readonly prisma: PrismaService) { }

  async assignSystemRole(params: {
    userId: string;
    organizationId: string;
    level: RoleLevel;
    branchId?: string;
  }): Promise<void> {
    const role = await this.prisma.client.role.findFirst({
      where: {
        organizationId: params.organizationId,
        level: params.level,
        isSystem: true,
      },
    });

    if (!role) {
      throw new NotFoundException(
        `System role '${params.level}' has not been seeded for organization '${params.organizationId}'. Run the RBAC seed handler on organization creation.`,
      );
    }

    // upsert, not create: this must be safe to call more than once for
    // the same (user, role) pair without throwing. It's defense in
    // depth — the event registry now guarantees a handler never fires
    // twice for the same event — but a repository method this
    // consequential (assigning OWNER) should not depend on that being
    // the only thing standing between it and a crash.
    await this.prisma.client.userRole.upsert({
      where: { userId_roleId: { userId: params.userId, roleId: role.id } },
      create: {
        userId: params.userId,
        roleId: role.id,
        branchId: params.branchId ?? null,
      },
      update: {
        branchId: params.branchId ?? null,
      },
    });
  }

  async hasOwner(organizationId: string): Promise<boolean> {
    const owner = await this.prisma.client.userRole.findFirst({
      where: {
        role: {
          organizationId,
          level: RoleLevel.OWNER,
        },
      },
      select: { userId: true },
    });

    return owner !== null;
  }

  async getEffectiveAccess(userId: string): Promise<EffectiveAccess> {
    const userRoles = await this.prisma.client.userRole.findMany({
      where: { userId },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: { permission: true },
            },
          },
        },
      },
    });

    const roles = new Set<string>();
    const permissions = new Set<string>();

    for (const userRole of userRoles) {
      roles.add(userRole.role.name);
      for (const rolePermission of userRole.role.rolePermissions) {
        permissions.add(rolePermission.permission.code);
      }
    }

    return {
      roles: [...roles],
      permissions: [...permissions],
    };
  }

  async listRolesForOrganization(organizationId: string): Promise<RoleSummary[]> {
    const roles = await this.prisma.client.role.findMany({
      where: { organizationId },
      orderBy: { level: 'asc' },
      include: { rolePermissions: { include: { permission: true } } }
    });

    return roles.map((role: {
      rolePermissions: any; id: string; name: string; level: string
    }) => ({
      id: role.id,
      name: role.name,
      level: role.level as RoleLevel,
      permissions: role.rolePermissions.map(
        (rolePermission: { permission: { code: any; }; }) =>
          rolePermission.permission.code,
      ),
    }));
  }

  async getUserRole(userId: string): Promise<RoleSummary | null> {
    const userRole = await this.prisma.client.userRole.findFirst({
      where: { userId },
      include: { role: true },
    });

    if (!userRole) return null;

    return { id: userRole.role.id, name: userRole.role.name, level: userRole.role.level as RoleLevel };
  }

  async setUserRole(params: {
    userId: string;
    organizationId: string;
    roleId: string;
  }): Promise<void> {
    const role = await this.prisma.client.role.findFirst({
      where: { id: params.roleId, organizationId: params.organizationId },
    });

    if (!role) {
      throw new NotFoundException(
        `Role '${params.roleId}' does not belong to organization '${params.organizationId}'`,
      );
    }

    await this.prisma.client.$transaction([
      this.prisma.client.userRole.deleteMany({ where: { userId: params.userId } }),
      this.prisma.client.userRole.create({
        data: { userId: params.userId, roleId: params.roleId },
      }),
    ]);
  }
}