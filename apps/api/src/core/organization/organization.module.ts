import { Module } from '@nestjs/common';
import { OrganizationController } from './presentation/controllers/organization.controller';
import { CreateOrganizationHandler } from './application/create-organization/create-organization.handler';
import { GetOrganizationHandler } from './application/get-organization/get-organization.handler';
import { OrganizationPrismaRepository } from './infrastructure/prisma/organization.prisma.repository';
import { UpdateOrganizationHandler } from './application/update-organization/update-organization.handler';
import { ListOrganizationsHandler } from './application/list-organizations/list-organizations.handler';
import { DeleteOrganizationHandler } from './application/delete-organization/delete-organizations.handler';
import { ORGANIZATION_REPOSITORY } from './domain/repositories';
import {
  CreateDefaultBranchHandler,
  OrganizationAuditLogHandler,
} from './application/event-handlers';
import { BranchModule } from '@/core/branch/branch.module';
import { AuditModule } from '../audit/audit.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [BranchModule, AuditModule, NotificationModule],
  controllers: [OrganizationController],
  providers: [
    CreateOrganizationHandler,
    GetOrganizationHandler,
    UpdateOrganizationHandler,
    ListOrganizationsHandler,
    DeleteOrganizationHandler,
    CreateDefaultBranchHandler,
    OrganizationAuditLogHandler,
    {
      provide: ORGANIZATION_REPOSITORY,
      useClass: OrganizationPrismaRepository,
    },
  ],
  exports: [ORGANIZATION_REPOSITORY],
})
export class OrganizationModule {}
