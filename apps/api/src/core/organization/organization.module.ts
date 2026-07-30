import { Module } from "@nestjs/common";
import { OrganizationController } from "./presentation/controllers/organization.controller";
import { CreateOrganizationHandler, GetOrganizationHandler, GetOrganizationsHandler } from "./application/create-organization/create-organization.handler";
import { OrganizationPrismaRepository } from "./infrastructure/prisma/organization.prisma.repository";
import { UpdateOrganizationHandler } from "./application/update-organization/update-organization.handler";
import { ListOrganizationsHandler } from "./application/list-organizations/list-organizations.handler";
import { DeleteOrganizationHandler } from "./application/delete-organization/delete-organizations.handler";
import { ORGANIZATION_REPOSITORY } from "./domain/repositories";
import { SendWelcomeEmailHandler } from "./application/event-handlers/send-welcome-email.handler";
import { AuditLogHandler } from "./application/event-handlers";

@Module({
  controllers: [
    OrganizationController,
  ],
  providers: [
    CreateOrganizationHandler,
    GetOrganizationHandler,
    GetOrganizationsHandler,
    UpdateOrganizationHandler,
    ListOrganizationsHandler,
    DeleteOrganizationHandler,
    SendWelcomeEmailHandler,
    CreateOrganizationHandler,
    AuditLogHandler,
    {
      provide: ORGANIZATION_REPOSITORY,
      useClass: OrganizationPrismaRepository,
    },
  ],
})
export class OrganizationModule {}