import { Inject, Injectable } from '@nestjs/common';
import { AUDIT_LOG_REPOSITORY } from '../../domain/repositories';
import type { AuditLogRepository } from '../../domain/repositories';
import { GetAuditLogQuery } from './get-audit-log.query';

@Injectable()
export class GetAuditLogHandler {
  constructor(
    @Inject(AUDIT_LOG_REPOSITORY)
    private readonly repository: AuditLogRepository,
  ) {}

  async execute(query: GetAuditLogQuery) {
    const { items, total } = await this.repository.findByOrganization(
      query.organizationId,
      {
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      },
      query.filters,
    );

    return {
      items,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / query.limit)),
      },
    };
  }
}
