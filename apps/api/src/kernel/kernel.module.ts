import { Module } from "@nestjs/common";
import { OrganizationModule } from "src/core/organization/organization.module";

@Module({
  imports: [OrganizationModule],
  exports: [],
})
export class KernelModule {}