import { Module } from "@nestjs/common";
import { OrganizationModule } from "@/core/organization/organization.module";

@Module({
  imports: [OrganizationModule],
  exports: [],
})
export class KernelModule {}