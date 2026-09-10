export interface AuditLogEntry {
  id: string;
  organizationId: string;
  branchId?: string;
  actorUserId?: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}
