import { Inject, Injectable } from '@nestjs/common';

import { EventHandler, IEventHandler } from '@/common/ddd';
import { AUDIT_LOG_REPOSITORY } from '@/core/audit/domain/repositories';
import type { AuditLogRepository } from '@/core/audit/domain/repositories';

import { BranchCreatedEvent } from '../../domain/events';

@Injectable()
@EventHandler(BranchCreatedEvent)
export class BranchAuditLogHandler implements IEventHandler<BranchCreatedEvent> {
  constructor(
    @Inject(AUDIT_LOG_REPOSITORY)
    private readonly auditLogRepository: AuditLogRepository,
  ) {}

  async handle(event: BranchCreatedEvent): Promise<void> {
    await this.auditLogRepository.record({
      organizationId: event.organizationId,
      branchId: event.branchId,
      action: 'branch.created',
      entityType: 'Branch',
      entityId: event.branchId,
      metadata: { name: event.name },
    });
  }
}
