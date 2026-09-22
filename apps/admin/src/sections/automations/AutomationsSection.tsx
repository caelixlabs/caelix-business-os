'use client';

import { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';

import { useOrganizationContext } from '@/contexts/organization/OrganizationContext';
import {
  useAutomations,
  useAutomationTriggers,
  useDeleteAutomation,
  useToggleAutomation,
} from '@/features/automations/api/use-automations';
import { ACTION_LABELS, type AutomationRule } from '@/features/automations/types';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { DataTable } from '@/components/data/data-table';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { PermissionGate } from '@/core/access/components/permission-gate';
import { formatDate } from '@/lib/format';
import { CreateAutomationForm } from './components/CreateAutomationForm';

export function AutomationsSection() {
  const { organization } = useOrganizationContext();
  const organizationId = organization?.id;
  const { data: rules, isLoading } = useAutomations(organizationId);
  const { data: triggers } = useAutomationTriggers(organizationId);
  const toggle = useToggleAutomation(organizationId ?? '');
  const remove = useDeleteAutomation(organizationId ?? '');
  const [dialogOpen, setDialogOpen] = useState(false);

  const triggerLabel = (key: string) => triggers?.find((trigger) => trigger.key === key)?.label ?? key;

  const columns: ColumnDef<AutomationRule, unknown>[] = [
    { accessorKey: 'name', header: 'Rule' },
    {
      id: 'when',
      header: 'When',
      accessorFn: (row) => {
        const condition = row.conditions?.[0];
        return `${triggerLabel(row.trigger)}${condition ? ` (${condition.field} = ${condition.equals})` : ''}`;
      },
    },
    { id: 'action', header: 'Then', accessorFn: (row) => ACTION_LABELS[row.actionType] },
    { accessorKey: 'runCount', header: 'Runs' },
    {
      accessorKey: 'lastRunAt',
      header: 'Last run',
      cell: ({ getValue }) => (getValue() ? formatDate(getValue() as string, 'relative') : '—'),
    },
    {
      id: 'enabled',
      header: 'Active',
      cell: ({ row }) => (
        <PermissionGate permission="automation:manage" fallback={<span>{row.original.enabled ? 'On' : 'Off'}</span>}>
          <Switch
            checked={row.original.enabled}
            label={`Toggle ${row.original.name}`}
            onCheckedChange={(enabled) => toggle.mutate({ id: row.original.id, enabled })}
          />
        </PermissionGate>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <PermissionGate permission="automation:manage">
          <button
            type="button"
            aria-label={`Delete ${row.original.name}`}
            onClick={() => remove.mutate(row.original.id)}
            className="text-text-secondary hover:text-danger"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </PermissionGate>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Automations"
        description="Do the follow-up work for you: when something happens in your business, act on it automatically."
        action={
          <PermissionGate permission="automation:manage">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>New automation</Button>
              </DialogTrigger>
              <DialogContent title="Create an automation" description="Choose what triggers it and what should happen.">
                {organizationId && <CreateAutomationForm organizationId={organizationId} onDone={() => setDialogOpen(false)} />}
              </DialogContent>
            </Dialog>
          </PermissionGate>
        }
      />

      <DataTable
        columns={columns}
        data={rules ?? []}
        loading={isLoading}
        searchPlaceholder="Search automations..."
        emptyTitle="No automations yet"
        emptyDescription="Create one to be alerted about new enquiries, cancelled bookings, low stock and more."
      />
    </div>
  );
}
