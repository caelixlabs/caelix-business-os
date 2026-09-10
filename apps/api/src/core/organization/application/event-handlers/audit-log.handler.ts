import { Inject, Injectable } from '@nestjs/common';

import { EventHandler, IEventHandler } from '@/common/ddd';
import { AUDIT_LOG_REPOSITORY } from '@/core/audit/domain/repositories';
import type { AuditLogRepository } from '@/core/audit/domain/repositories';

import { OrganizationCreatedEvent } from '../../domain/events';

@Injectable()
@EventHandler(OrganizationCreatedEvent)
export class OrganizationAuditLogHandler implements IEventHandler<OrganizationCreatedEvent> {
  constructor(
    @Inject(AUDIT_LOG_REPOSITORY)
    private readonly auditLogRepository: AuditLogRepository,
  ) {}

  async handle(event: OrganizationCreatedEvent): Promise<void> {
    await this.auditLogRepository.record({
      organizationId: event.organizationId,
      action: 'organization.created',
      entityType: 'Organization',
      entityId: event.organizationId,
      metadata: { name: event.name, slug: event.slug },
    });
  }
}
