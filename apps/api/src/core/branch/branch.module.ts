import { Module } from '@nestjs/common';
import { BRANCH_REPOSITORY } from './domain/repositories';
import { BranchPrismaRepository } from './infrastructure/prisma/branch.prisma.repository';
import { BranchController } from './presentation/controllers/branch.controller';
import { CreateBranchHandler } from './application/create-branch/create-branch.handler';
import { GetBranchHandler } from './application/get-branch/get-branch.handler';
import { UpdateBranchHandler } from './application/update-branch/update-branch.handler';
import { ArchiveBranchHandler } from './application/archive-branch/archive-branch.handler';
import { ActivateBranchHandler } from './application/activate-branch/activate-branch.handler';
import { DeleteBranchHandler } from './application/delete-branch/delete-branch.handler';
import { ListBranchesHandler } from './application/get-branch/list-branches.handler';
import { BranchAuditLogHandler } from './application';
import { AuditModule } from '../audit/audit.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [AuditModule, NotificationModule],
  controllers: [BranchController],
  providers: [
    CreateBranchHandler,
    GetBranchHandler,
    ListBranchesHandler,
    UpdateBranchHandler,
    ArchiveBranchHandler,
    ActivateBranchHandler,
    DeleteBranchHandler,
    BranchPrismaRepository,
    BranchAuditLogHandler,
    {
      provide: BRANCH_REPOSITORY,
      useClass: BranchPrismaRepository,
    },
  ],
  exports: [BRANCH_REPOSITORY],
})
export class BranchModule {}
