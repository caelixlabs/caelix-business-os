'use client';

import { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';

import { useOrganizationContext } from '@/contexts/organization/OrganizationContext';
import { useEnquiries, useUpdateEnquiryStatus } from '@/features/enquiries/api/use-enquiries';
import type { Enquiry, EnquiryStatus } from '@/features/enquiries/types';
import { useContacts } from '@/features/contacts/api/use-contacts';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/data/data-table';
import { StatCard } from '@/components/data/stat-card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { PermissionGate } from '@/core/access/components/permission-gate';
import { CreateEnquiryForm } from './components/CreateEnquiryForm';
import { AlertCircle, PhoneCall, ThumbsUp, Trophy } from 'lucide-react';

const STATUS_TONE: Record<string, 'success' | 'neutral' | 'danger' | 'info' | 'accent'> = {
  NEW: 'info',
  CONTACTED: 'accent',
  QUALIFIED: 'accent',
  CONVERTED: 'success',
  LOST: 'neutral',
};

const NEXT_ACTIONS: Record<string, { label: string; status: EnquiryStatus; danger?: boolean }[]> = {
  NEW: [{ label: 'Mark contacted', status: 'CONTACTED' }],
  CONTACTED: [
    { label: 'Qualify', status: 'QUALIFIED' },
    { label: 'Convert', status: 'CONVERTED' },
    { label: 'Mark lost', status: 'LOST', danger: true },
  ],
  QUALIFIED: [
    { label: 'Convert', status: 'CONVERTED' },
    { label: 'Mark lost', status: 'LOST', danger: true },
  ],
  CONVERTED: [],
  LOST: [],
};

export function EnquiriesSection() {
  const { organization } = useOrganizationContext();
  const organizationId = organization?.id;
  const { data: enquiries, isLoading } = useEnquiries(organizationId);
  const { data: contacts } = useContacts(organizationId);
  const updateStatus = useUpdateEnquiryStatus(organizationId ?? '');
  const [dialogOpen, setDialogOpen] = useState(false);

  const contactName = (contactId: string) => {
    const contact = contacts?.find((c) => c.id === contactId);
    if (!contact) return contactId;
    return contact.type === 'BUSINESS'
      ? contact.companyName ?? '—'
      : `${contact.firstName ?? ''} ${contact.lastName ?? ''}`.trim() || '—';
  };

  const newCount = enquiries?.filter((e) => e.status === 'NEW').length ?? 0;
  const inProgressCount = enquiries?.filter((e) => e.status === 'CONTACTED' || e.status === 'QUALIFIED').length ?? 0;
  const convertedCount = enquiries?.filter((e) => e.status === 'CONVERTED').length ?? 0;
  const lostCount = enquiries?.filter((e) => e.status === 'LOST').length ?? 0;

  const columns: ColumnDef<Enquiry, unknown>[] = [
    { id: 'contact', header: 'Contact', accessorFn: (row) => contactName(row.contactId) },
    { accessorKey: 'subject', header: 'Subject' },
    {
      accessorKey: 'source',
      header: 'Source',
      cell: ({ getValue }) => <span className="text-xs text-text-secondary">{(getValue() as string).replace('_', ' ').toLowerCase()}</span>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => {
        const value = getValue() as string;
        return <Badge tone={STATUS_TONE[value] ?? 'neutral'}>{value.toLowerCase()}</Badge>;
      },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const enquiry = row.original;
        const actions = NEXT_ACTIONS[enquiry.status] ?? [];
        return (
          <PermissionGate permission="enquiry:manage">
            <div className="flex justify-end gap-1.5">
              {actions.map((action) => (
                <Button
                  key={action.status}
                  variant="ghost"
                  className={`!px-2 !py-1 text-xs ${action.danger ? 'text-danger' : ''}`}
                  disabled={updateStatus.isPending}
                  onClick={() => updateStatus.mutate({ id: enquiry.id, status: action.status })}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </PermissionGate>
        );
      },
    },
  ];

  return (
    <div>
      <PageHeader
        title="Enquiries"
        description="Manage incoming leads through to conversion."
        action={
          <PermissionGate permission="enquiry:create">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>Log enquiry</Button>
              </DialogTrigger>
              <DialogContent title="Log an enquiry" description="Record a new lead for follow-up.">
                {organizationId && <CreateEnquiryForm organizationId={organizationId} onDone={() => setDialogOpen(false)} />}
              </DialogContent>
            </Dialog>
          </PermissionGate>
        }
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-4">
        <StatCard title="New" value={newCount} description="awaiting first contact" icon={AlertCircle} />
        <StatCard title="In progress" value={inProgressCount} description="contacted or qualified" icon={PhoneCall} />
        <StatCard title="Converted" value={convertedCount} description="all time" icon={Trophy} />
        <StatCard title="Lost" value={lostCount} description="all time" icon={ThumbsUp} />
      </div>

      <DataTable
        columns={columns}
        data={enquiries ?? []}
        loading={isLoading}
        searchPlaceholder="Search enquiries..."
        emptyTitle="No enquiries yet"
        emptyDescription="Log your first enquiry to start the pipeline."
      />
    </div>
  );
}
