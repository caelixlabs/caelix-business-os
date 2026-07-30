import { Module } from '@nestjs/common';
import { PrismaModule } from '../common/prisma/prisma.module';
import { KernelModule } from '../kernel/kernel.module';
import { EventsModule } from '@/common/ddd';
import { OrganizationModule } from '@/core/organization/organization.module';
import { BranchModule } from '@/core/branch/branch.module'

@Module({
  imports: [
    PrismaModule,
    KernelModule,
    EventsModule,
    OrganizationModule,
    BranchModule,
  ],
})
export class AppModule {}