import { Module } from "@nestjs/common";
import { OrganizationController } from "./presentation/controllers/organization.controller";
import { CreateOrganizationHandler, GetOrganizationHandler, GetOrganizationsHandler } from "./application/create-organization/create-organization.handler";
import { OrganizationRepository } from "./domain/repositories/organization.repository";
import { OrganizationPrismaRepository } from "./infrastructure/prisma/organization.prisma.repository";
import { UpdateOrganizationHandler } from "./application/update-organization/update-organization.handler";
import { ListOrganizationsHandler } from "./application/list-organizations/list-organizations.handler";
import { DeleteOrganizationHandler } from "./application/delete-organization/delete-organizations.handler";

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
    {
      provide: OrganizationRepository,
      useClass: OrganizationPrismaRepository,
    },
  ],
})
export class OrganizationModule {}