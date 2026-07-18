import { Module } from "@nestjs/common";
import { OrganizationController } from "./presentation/controllers/organization.controller";
import { CreateOrganizationHandler } from "./application/ handlers/create-organization.handler";
import { OrganizationRepository } from "./domain/repositories/organization.repository";
import { OrganizationPrismaRepository } from "./infrastructure/prisma/organization.prisma.repository";

@Module({
  controllers: [
    OrganizationController,
  ],
  providers: [
    CreateOrganizationHandler,
    {
      provide: OrganizationRepository,
      useClass: OrganizationPrismaRepository,
    },
  ],
})
export class OrganizationModule {}