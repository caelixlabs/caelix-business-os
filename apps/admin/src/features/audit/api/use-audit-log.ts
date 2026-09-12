import { useQuery } from "@tanstack/react-query";

import { apiGet } from "@/api/client";

import type { PaginatedResult } from "@/api/types";
import type { AuditLogEntry } from "../types";

export interface AuditLogFilters {
  action?: string;
  entityType?: string;
  actorUserId?: string;
}

export type AuditLogResult = PaginatedResult<AuditLogEntry>;

export const auditApi = {
  list: (
    organizationId: string,
    page = 1,
    limit = 20,
    filters: AuditLogFilters = {}
  ) => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));

    if (filters.action) {
      params.set("action", filters.action);
    }

    if (filters.entityType) {
      params.set("entityType", filters.entityType);
    }

    if (filters.actorUserId) {
      params.set("actorUserId", filters.actorUserId);
    }

    return apiGet<AuditLogResult>(
      `/organizations/${organizationId}/audit-log?${params.toString()}`
    );
  },
};

export function useAuditLog(
  organizationId: string | undefined,
  page: number,
  filters: AuditLogFilters = {}
) {
  return useQuery({
    queryKey: ["audit-log", organizationId, page, filters],
    queryFn: () => auditApi.list(organizationId as string, page, 20, filters),
    enabled: Boolean(organizationId),
  });
}
