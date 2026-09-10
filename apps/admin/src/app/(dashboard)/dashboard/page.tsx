"use client";

import Link from "next/link";

import { useAuthStore } from "@/store/auth.store";

import { useBranches } from "@/features/branches/api/use-branches";
import { useUsers } from "@/features/users/api/use-users";
import { useNotifications } from "@/features/notifications/api/use-notifications";

import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { StatusBadge } from "@/components/ui/badge";

export default function DashboardOverviewPage() {
  const user = useAuthStore((s) => s.user);
  const organizationId = user?.organizationId;
  const { data: branches } = useBranches(organizationId);
  const { data: users } = useUsers(organizationId);
  const { data: notifications } = useNotifications();

  const activeBranches =
    branches?.filter((branch) => branch.status === "ACTIVE").length ?? 0;

  const archivedBranches =
    branches?.filter((branch) => branch.status === "ARCHIVED").length ?? 0;

  const activeUsers =
    users?.filter((user) => user.status === "ACTIVE").length ?? 0;

  const invitedUsers =
    users?.filter((user) => user.status === "INVITED").length ?? 0;

  const suspendedUsers =
    users?.filter((user) => user.status === "SUSPENDED").length ?? 0;

  return (
    <div>
      <PageHeader
        title={`Welcome back${user ? `, ${user.firstName}` : ""}`}
        description="Here's what's happening across your organization."
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard
          label="Branches"
          value={branches?.length}
          href="/dashboard/branches"
        />

        <StatCard
          label="Active branches"
          value={activeBranches}
          href="/dashboard/branches"
        />

        <StatCard
          label="Archived branches"
          value={archivedBranches}
          href="/dashboard/branches"
        />

        <StatCard label="Users" value={users?.length} href="/dashboard/users" />

        <StatCard
          label="Active users"
          value={activeUsers}
          href="/dashboard/users"
        />

        <StatCard
          label="Invited users"
          value={invitedUsers}
          href="/dashboard/users"
        />

        <StatCard
          label="Suspended users"
          value={suspendedUsers}
          href="/dashboard/users"
        />

        <StatCard
          label="Unread notifications"
          value={notifications?.unreadCount}
          href="/dashboard/notifications"
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <RecentBranches branches={branches} />

        <RecentUsers users={users} />
      </div>
    </div>
  );
}

function RecentBranches({
  branches,
}: {
  branches: Awaited<ReturnType<typeof useBranches>>["data"] | undefined;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-text">Recent branches</h2>

        <Link
          href="/dashboard/branches"
          className="text-xs font-medium text-accent hover:underline"
        >
          View all
        </Link>
      </div>

      <Card>
        {branches === undefined ? (
          <div className="flex justify-center p-8">
            <Spinner />
          </div>
        ) : branches.length === 0 ? (
          <p className="p-6 text-sm text-text-secondary">No branches yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {branches.slice(0, 5).map((branch) => (
              <li
                key={branch.id}
                className="flex items-center justify-between px-5 py-3.5"
              >
                <div>
                  <p className="text-sm font-medium text-text">{branch.name}</p>

                  <p className="font-mono text-xs text-text-secondary">
                    {branch.code}
                  </p>
                </div>

                <StatusBadge
                  status={branch.type === "PRIMARY" ? "PRIMARY" : branch.status}
                />
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function RecentUsers({
  users,
}: {
  users: Awaited<ReturnType<typeof useUsers>>["data"] | undefined;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-text">Recent users</h2>

        <Link
          href="/dashboard/users"
          className="text-xs font-medium text-accent hover:underline"
        >
          View all
        </Link>
      </div>

      <Card>
        {users === undefined ? (
          <div className="flex justify-center p-8">
            <Spinner />
          </div>
        ) : users.length === 0 ? (
          <p className="p-6 text-sm text-text-secondary">No users yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {users.slice(0, 5).map((user) => (
              <li
                key={user.id}
                className="flex items-center justify-between px-5 py-3.5"
              >
                <div>
                  <p className="text-sm font-medium text-text">
                    {user.fullName}
                  </p>

                  <p className="text-xs text-text-secondary">{user.email}</p>
                </div>

                <StatusBadge status={user.status} />
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function StatCard({
  label,
  value,
  href,
}: {
  label: string;
  value?: number;
  href: string;
}) {
  return (
    <Link href={href}>
      <Card className="p-5 transition-colors hover:border-accent">
        <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
          {label}
        </p>

        <p className="mt-2 text-2xl font-semibold text-text">{value ?? "—"}</p>
      </Card>
    </Link>
  );
}
