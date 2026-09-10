"use client";

import { ShieldCheck } from "lucide-react";

import { useAuthStore } from "@/store/auth.store";

import { useRoles } from "@/features/rbac/api/use-roles";

import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { RoleSummary } from "@/features/auth/types";

const PERMISSIONS: Record<string, string[]> = {
  OWNER: ["organization:*", "branch:*", "user:*"],

  ADMIN: [
    "organization:read",
    "organization:update",
    "branch:create",
    "branch:read",
    "branch:update",
    "branch:archive",
    "user:read",
    "user:invite",
    "user:update",
    "user:suspend",
    "user:role-assign",
  ],

  MANAGER: ["organization:read", "branch:read", "branch:update", "user:read"],

  EMPLOYEE: ["organization:read", "branch:read", "user:read"],

  VIEWER: ["organization:read", "branch:read"],
};

export default function RolesPage() {
  const user = useAuthStore((s) => s.user);

  const { data: roles, isLoading, isError } = useRoles(user?.organizationId);

  return (
    <div>
      <PageHeader
        title="Roles & permissions"
        description="View the system roles and the permissions granted to each role."
      />

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : isError ? (
        <EmptyState
          title="Could not load roles"
          description="Please refresh the page and try again."
        />
      ) : !roles || roles.length === 0 ? (
        <EmptyState
          title="No roles found"
          description="System roles should be created automatically when an organization is created."
        />
      ) : (
        <div className="grid gap-4">
          {roles
            .slice()
            .sort(
              (a: RoleSummary, b: RoleSummary) =>
                roleRank(a.level) - roleRank(b.level)
            )
            .map((role: RoleSummary) => (
              <Card key={role.id} className="p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-accent-soft">
                    <ShieldCheck className="h-4 w-4 text-accent" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-semibold text-text">
                        {role.name}
                      </h2>

                      <Badge tone="neutral">{role.level}</Badge>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {(PERMISSIONS[role.level] ?? []).map((permission) => (
                        <span
                          key={permission}
                          className="rounded-md border border-border bg-canvas px-2.5 py-1 font-mono text-[11px] text-text-secondary"
                        >
                          {permission}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
}

function roleRank(level: RoleSummary["level"]) {
  const order = ["OWNER", "ADMIN", "MANAGER", "EMPLOYEE", "VIEWER"];

  return order.indexOf(level);
}
