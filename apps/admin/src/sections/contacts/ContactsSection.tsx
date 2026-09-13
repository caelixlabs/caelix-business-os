'use client';

import { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';

import { useOrganizationContext } from '@/contexts/organization/OrganizationContext';
import { useContacts, useToggleContactStatus } from '@/features/contacts/api/use-contacts';
import type { Contact } from '@/features/contacts/types';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/data/data-table';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { PermissionGate } from '@/core/access/components/permission-gate';
import { CreateContactForm } from './components/CreateContactForm';
import { EditContactDialog } from './components/EditContactDialog';

const STATUS_TONE: Record<string, 'success' | 'neutral' | 'danger'> = {
  ACTIVE: 'success',
  INACTIVE: 'neutral',
  ARCHIVED: 'danger',
};

export function ContactsSection() {
  const { organization } = useOrganizationContext();
  const organizationId = organization?.id;
  const { data: contacts, isLoading } = useContacts(organizationId);
  const toggleStatus = useToggleContactStatus(organizationId ?? '');
  const [dialogOpen, setDialogOpen] = useState(false);

  const displayName = (contact: Contact) =>
    contact.type === 'BUSINESS'
      ? contact.companyName ?? '—'
      : `${contact.firstName ?? ''} ${contact.lastName ?? ''}`.trim() || '—';

  const columns: ColumnDef<Contact, unknown>[] = [
    {
      id: 'name',
      header: 'Name',
      accessorFn: (row) => displayName(row),
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-text">{displayName(row.original)}</p>
          <p className="text-xs text-text-secondary">{row.original.type === 'BUSINESS' ? 'Business' : 'Person'}</p>
        </div>
      ),
    },
    {
      id: 'contact',
      header: 'Contact',
      cell: ({ row }) => (
        <div className="text-xs text-text-secondary">
          {row.original.email && <p>{row.original.email}</p>}
          {row.original.phone && <p>{row.original.phone}</p>}
          {!row.original.email && !row.original.phone && '—'}
        </div>
      ),
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
        const contact = row.original;
        return (
          <div className="flex justify-end gap-1.5">
            <PermissionGate permission="contact:update">
              <EditContactDialog contact={contact} organizationId={organizationId ?? ''} />
            </PermissionGate>
            <PermissionGate permission="contact:archive">
              <Button
                variant="ghost"
                className="!px-2 !py-1 text-xs"
                disabled={toggleStatus.isPending}
                onClick={() =>
                  toggleStatus.mutate({
                    id: contact.id,
                    nextStatus: contact.status === 'ARCHIVED' ? 'ACTIVE' : 'ARCHIVED',
                  })
                }
              >
                {contact.status === 'ARCHIVED' ? 'Activate' : 'Archive'}
              </Button>
            </PermissionGate>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <PageHeader
        title="Contacts"
        description="Every person and business your organization deals with."
        action={
          <PermissionGate permission="contact:create">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>New contact</Button>
              </DialogTrigger>
              <DialogContent title="Add a contact" description="Create a new person or business record.">
                {organizationId && (
                  <CreateContactForm organizationId={organizationId} onDone={() => setDialogOpen(false)} />
                )}
              </DialogContent>
            </Dialog>
          </PermissionGate>
        }
      />

      <DataTable
        columns={columns}
        data={contacts ?? []}
        loading={isLoading}
        searchPlaceholder="Search contacts..."
        emptyTitle="No contacts yet"
        emptyDescription="Add your first contact to get started."
      />
    </div>
  );
}
