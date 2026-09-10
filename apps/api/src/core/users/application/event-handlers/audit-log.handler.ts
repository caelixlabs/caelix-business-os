import { Inject, Injectable } from '@nestjs/common';

import { EventHandler, IEventHandler } from '@/common/ddd';
import { AUDIT_LOG_REPOSITORY } from '@/core/audit/domain/repositories';
import type { AuditLogRepository } from '@/core/audit/domain/repositories';

import { UserRegisteredEvent } from '../../domain/events';

@Injectable()
@EventHandler(UserRegisteredEvent)
export class UserAuditLogHandler implements IEventHandler<UserRegisteredEvent> {
  constructor(
    @Inject(AUDIT_LOG_REPOSITORY)
    private readonly auditLogRepository: AuditLogRepository,
  ) {}

  async handle(event: UserRegisteredEvent): Promise<void> {
    await this.auditLogRepository.record({
      organizationId: event.organizationId,
      actorUserId: event.userId,
      action: 'user.registered',
      entityType: 'User',
      entityId: event.userId,
      metadata: { email: event.email },
    });
  }
}
