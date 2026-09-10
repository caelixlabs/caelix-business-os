"use client";

import { useState } from "react";

import { useAuthStore } from "@/store/auth.store";

import {
  useAuditLog,
  type AuditLogFilters,
} from "@/features/audit/api/use-audit-log";

import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

const ACTION_LABELS: Record<string, string> = {
  "organization.created": "Organization created",

  "branch.created": "Branch created",

  "user.registered": "User registered",
};

const ACTIONS = [
  {
    value: "",
    label: "All actions",
  },

  {
    value: "organization.created",
    label: "Organization created",
  },

  {
    value: "branch.created",
    label: "Branch created",
  },

  {
    value: "user.registered",
    label: "User registered",
  },
];

const ENTITY_TYPES = [
  {
    value: "",
    label: "All entities",
  },

  {
    value: "Organization",
    label: "Organization",
  },

  {
    value: "Branch",
    label: "Branch",
  },

  {
    value: "User",
    label: "User",
  },
];

export default function AuditLogPage() {
  const user = useAuthStore((s) => s.user);

  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState<AuditLogFilters>({});

  const { data: result, isLoading } = useAuditLog(
    user?.organizationId,
    page,
    filters
  );

  function updateFilter(key: keyof AuditLogFilters, value: string) {
    setPage(1);

    setFilters((current) => ({
      ...current,
      [key]: value || undefined,
    }));
  }

  return (
    <div>
      <PageHeader
        title="Audit log"
        description="A record of what happened, and when."
      />

      <Card className="mb-4 p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <Select
            value={filters.action ?? ""}
            onValueChange={(value) => updateFilter("action", value)}
          >
            <SelectTrigger>
              <span>
                {
                  ACTIONS.find((item) => item.value === (filters.action ?? ""))
                    ?.label
                }
              </span>
            </SelectTrigger>

            <SelectContent>
              {ACTIONS.map((item) => (
                <SelectItem key={item.value} value={item.value || "ALL"}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.entityType ?? ""}
            onValueChange={(value) => updateFilter("entityType", value)}
          >
            <SelectTrigger>
              <span>
                {
                  ENTITY_TYPES.find(
                    (item) => item.value === (filters.entityType ?? "")
                  )?.label
                }
              </span>
            </SelectTrigger>

            <SelectContent>
              {ENTITY_TYPES.map((item) => (
                <SelectItem key={item.value} value={item.value || "ALL"}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {isLoading || !result ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : result.items.length === 0 ? (
        <EmptyState title="Nothing recorded yet" />
      ) : (
        <>
          <Card>
            <ul className="divide-y divide-border">
              {result.items.map((entry) => (
                <li
                  key={entry.id}
                  className="flex items-start justify-between gap-4 px-5 py-4"
                >
                  <div>
                    <p className="text-sm font-medium text-text">
                      {ACTION_LABELS[entry.action] ?? entry.action}
                    </p>

                    <p className="mt-0.5 font-mono text-xs text-text-secondary">
                      {entry.entityType}/{entry.entityId}
                    </p>
                  </div>

                  <time className="shrink-0 text-xs text-text-secondary">
                    {new Date(entry.createdAt).toLocaleString()}
                  </time>
                </li>
              ))}
            </ul>
          </Card>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-text-secondary">
              Page {result.meta.page} of {result.meta.totalPages} ·{" "}
              {result.meta.total} total entries
            </p>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>

              <Button
                variant="secondary"
                disabled={page >= result.meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
