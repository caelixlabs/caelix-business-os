import { Module } from '@nestjs/common';

import { AUDIT_LOG_REPOSITORY } from './domain/repositories';
import { AuditLogPrismaRepository } from './infrastructure/prisma/audit-log.prisma.repository';
import { AuditController } from './presentation/controllers/audit.controller';
import { GetAuditLogHandler } from './application/get-audit-log/get-audit-log.handler';

@Module({
  controllers: [AuditController],
  providers: [
    GetAuditLogHandler,
    {
      provide: AUDIT_LOG_REPOSITORY,
      useClass: AuditLogPrismaRepository,
    },
  ],
  exports: [AUDIT_LOG_REPOSITORY],
})
export class AuditModule {}
