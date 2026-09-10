import { Global, Module } from '@nestjs/common';
import { SeedOrganizationRolesHandler } from './event-handlers/seed-organization-roles.handler';
import { AssignDefaultRoleHandler } from './event-handlers/assign-default-role.handler';
import { PermissionsGuard } from './guards';
import { RBAC_REPOSITORY } from '../domain';
import { RbacPrismaRepository } from '../infrastructure/prisma/rbac.prisma.repository';
import { RolesController } from '../presentation/controllers/roles.controllers';
import { ListRolesHandler } from './list-roles/list-roles.hander';

@Global()
@Module({
  controllers: [RolesController],
  providers: [
    SeedOrganizationRolesHandler,
    AssignDefaultRoleHandler,
    ListRolesHandler,
    PermissionsGuard,
    {
      provide: RBAC_REPOSITORY,
      useClass: RbacPrismaRepository,
    },
  ],
  exports: [RBAC_REPOSITORY, PermissionsGuard],
})
export class RbacModule {}