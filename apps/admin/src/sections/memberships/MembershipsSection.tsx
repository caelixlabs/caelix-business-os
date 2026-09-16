'use client';

import { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { CreditCard, Package, Users } from 'lucide-react';

import { useOrganizationContext } from '@/contexts/organization/OrganizationContext';
import { useMembershipPlans, useMembershipSubscriptions } from '@/features/memberships/api/use-memberships';
import type { MembershipPlan, MembershipSubscription } from '@/features/memberships/types';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/data/data-table';
import { StatCard } from '@/components/data/stat-card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { PermissionGate } from '@/core/access/components/permission-gate';
import { formatCurrency, formatDate } from '@/lib/format';
import { CreateMembershipPlanForm } from './components/CreateMembershipPlanForm';
import { SubscribeMemberForm } from './components/SubscribeMemberForm';

const SUBSCRIPTION_TONE: Record<string, 'success' | 'neutral' | 'danger' | 'info'> = {
  ACTIVE: 'success',
  EXPIRED: 'neutral',
  CANCELLED: 'danger',
  PAST_DUE: 'info',
};

export function MembershipsSection() {
  const { organization } = useOrganizationContext();
  const organizationId = organization?.id;
  const { data: plans, isLoading: plansLoading } = useMembershipPlans(organizationId);
  const { data: subscriptions, isLoading: subsLoading } = useMembershipSubscriptions(organizationId);
  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [subscribeDialogOpen, setSubscribeDialogOpen] = useState(false);

  const activeCount = subscriptions?.filter((s) => s.status === 'ACTIVE').length ?? 0;

  const planColumns: ColumnDef<MembershipPlan, unknown>[] = [
    { accessorKey: 'name', header: 'Plan' },
    { accessorKey: 'durationDays', header: 'Duration (days)' },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }) => formatCurrency(Number(row.original.price), row.original.currency),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => (
        <Badge tone={getValue() === 'ACTIVE' ? 'success' : 'neutral'}>{(getValue() as string).toLowerCase()}</Badge>
      ),
    },
  ];

  const subscriptionColumns: ColumnDef<MembershipSubscription, unknown>[] = [
    {
      id: 'member',
      header: 'Member',
      accessorFn: (row) => `${row.contact?.firstName ?? ''} ${row.contact?.lastName ?? ''}`.trim() || '—',
    },
    { id: 'plan', header: 'Plan', accessorFn: (row) => row.plan.name },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => {
        const value = getValue() as string;
        return <Badge tone={SUBSCRIPTION_TONE[value] ?? 'neutral'}>{value.toLowerCase()}</Badge>;
      },
    },
    { accessorKey: 'expiresAt', header: 'Expires', cell: ({ getValue }) => formatDate(getValue() as string) },
  ];

  return (
    <div>
      <PageHeader
        title="Memberships"
        description="Plans your business sells and who's subscribed to them."
        action={
          <div className="flex gap-2">
            <PermissionGate permission="membership:plan-manage">
              <Dialog open={planDialogOpen} onOpenChange={setPlanDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="secondary">New plan</Button>
                </DialogTrigger>
                <DialogContent title="Create a membership plan" description="Define a plan members can subscribe to.">
                  {organizationId && <CreateMembershipPlanForm organizationId={organizationId} onDone={() => setPlanDialogOpen(false)} />}
                </DialogContent>
              </Dialog>
            </PermissionGate>

            <PermissionGate permission="membership:subscription-manage">
              <Dialog open={subscribeDialogOpen} onOpenChange={setSubscribeDialogOpen}>
                <DialogTrigger asChild>
                  <Button>Subscribe member</Button>
                </DialogTrigger>
                <DialogContent title="Subscribe a member" description="Assign a plan to a member.">
                  {organizationId && <SubscribeMemberForm organizationId={organizationId} onDone={() => setSubscribeDialogOpen(false)} />}
                </DialogContent>
              </Dialog>
            </PermissionGate>
          </div>
        }
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <StatCard title="Active subscriptions" value={activeCount} description="currently subscribed" icon={Users} />
        <StatCard title="Plans" value={plans?.length ?? 0} description="available to sell" icon={Package} />
        <StatCard
          title="Recurring value"
          value={formatCurrency(plans?.reduce((sum, p) => sum + Number(p.price), 0) ?? 0)}
          description="sum of all plan prices"
          icon={CreditCard}
        />
      </div>

      <div className="mb-3">
        <h3 className="text-sm font-semibold text-text">Plans</h3>
      </div>
      <DataTable
        columns={planColumns}
        data={plans ?? []}
        loading={plansLoading}
        searchPlaceholder="Search plans..."
        emptyTitle="No plans yet"
        emptyDescription="Create a plan to start selling memberships."
      />

      <div className="mb-3 mt-8">
        <h3 className="text-sm font-semibold text-text">Subscriptions</h3>
      </div>
      <DataTable
        columns={subscriptionColumns}
        data={subscriptions ?? []}
        loading={subsLoading}
        searchPlaceholder="Search subscriptions..."
        emptyTitle="No subscriptions yet"
        emptyDescription="Subscribe a member to a plan to see it here."
      />
    </div>
  );
}
