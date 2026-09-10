export interface AuditLogFilters {
  action?: string;
  entityType?: string;
  actorUserId?: string;
}

export class GetAuditLogQuery {
  constructor(
    public readonly organizationId: string,
    public readonly page: number,
    public readonly limit: number,
    public readonly filters: AuditLogFilters = {},
  ) {}
}