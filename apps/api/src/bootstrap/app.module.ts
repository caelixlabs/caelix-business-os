import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from '../common/prisma/prisma.module';
import { KernelModule } from '../kernel/kernel.module';
import { EventsModule } from '@/common/ddd';
import { OutboxModule } from '@/common/outbox';

import { OrganizationModule } from '@/core/organization/organization.module';
import { BranchModule } from '@/core/branch/branch.module';
import { UsersModule } from '@/core/users/users.module';
import { RbacModule } from '@/core/rbac/application/rbac.module';
import { AuditModule } from '@/core/audit/audit.module';
import { AuthModule } from '@/core/auth/auth.module';
import { SettingsModule } from '@/core/settings/settings.module';
import { NotificationModule } from '@/core/notification/notification.module';
import { MusicOrgModule } from '@/industry/music-org/music-org.module';
import { BusinessModule } from '@/business/business.module';
import { ProductsModule } from '@/business/products/products.module';
import { InventoryModule } from '@/business/inventory/inventory.module';
import { EnquiriesModule } from '@/business/enquiries/enquiries.module';
import { BookingModule } from '@/business/booking/booking.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    KernelModule,
    EventsModule,
    OrganizationModule,
    BranchModule,
    OutboxModule,
    UsersModule,
    RbacModule,
    AuthModule,
    AuditModule,
    SettingsModule,
    NotificationModule,
    MusicOrgModule,
    BusinessModule,
    ProductsModule,
    InventoryModule,
    EnquiriesModule,
    BookingModule,
  ],
})
export class AppModule {}
