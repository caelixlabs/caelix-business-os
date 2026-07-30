import { Module } from '@nestjs/common';
import { BRANCH_REPOSITORY } from './domain/repositories';
import { BranchPrismaRepository } from './infrastructure/prisma/branch.prisma.repository';
import { CreateDefaultBranchHandler } from '../organization/application/event-handlers/create-default-branch.handler';

@Module({
  providers: [
    CreateDefaultBranchHandler,
    {
      provide: BRANCH_REPOSITORY,
      useClass: BranchPrismaRepository,
    },
    BranchPrismaRepository,
  ],
  exports: [
    BRANCH_REPOSITORY,
  ],
})
export class BranchModule {}