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
import { GymModule } from '@/industry/gym/gym.module';
import { BusinessModule } from '@/business/business.module';
import { ProductsModule } from '@/business/products/products.module';
import { InventoryModule } from '@/business/inventory/inventory.module';
import { EnquiriesModule } from '@/business/enquiries/enquiries.module';
import { BookingModule } from '@/business/booking/booking.module';
import { InvoicesModule } from '@/business/invoices/invoices.module';
import { ReportsModule } from '@/business/reports/reports.module';
import { MailModule } from '@/capabilities/communication/mail/mail.module';
import { DocumentsModule } from '@/capabilities/documents/documents.module';
import { AttendanceModule } from '@/capabilities/attendance/attendance.module';
import { MembershipsModule } from '@/capabilities/memberships/memberships.module';
import { DashboardWidgetsModule } from '@/capabilities/dashboard-widgets/dashboard-widgets.module';
import { PosModule } from '@/capabilities/pos/pos.module';
import { CommunicationModule } from '@/capabilities/communication/communication.module';
import { SignaturesModule } from '@/capabilities/signatures/signatures.module';
import { AutomationsModule } from '@/capabilities/automations/automations.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    KernelModule,
    EventsModule,
    MailModule,
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
    InvoicesModule,
    DocumentsModule,
    ReportsModule,
    AttendanceModule,
    MembershipsModule,
    DashboardWidgetsModule,
    PosModule,
    AutomationsModule,
    SignaturesModule,
    CommunicationModule,
    GymModule,
  ],
})
export class AppModule {}
