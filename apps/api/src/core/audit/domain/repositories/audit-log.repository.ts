export interface AuditLogFilters {
  action?: string;
  entityType?: string;
  actorUserId?: string;
}

export interface RecordAuditEntryParams {
  organizationId: string;
  branchId?: string;
  actorUserId?: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
}

export interface AuditLogEntry extends RecordAuditEntryParams {
  id: string;
  createdAt: Date;
}

/**
 * Audit is an append-only log, not a DDD aggregate — there's no
 * behaviour to protect, just a durable record of "who did what to
 * which entity, and when." Any module can record an entry via
 * AuditLogRepository directly (or, more commonly, by reacting to a
 * domain event — see organization/application/event-handlers/audit-log.handler.ts
 * for the pattern).
 */
export interface AuditLogRepository {
  record(entry: RecordAuditEntryParams): Promise<void>;
  findByOrganization(
    organizationId: string,
    pagination: { skip: number; take: number },
    filters?: AuditLogFilters,
  ): Promise<{ items: AuditLogEntry[]; total: number }>;
}
