'use client';

import { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';

import { useOrganizationContext } from '@/contexts/organization/OrganizationContext';
import { useBookings, useConfirmBooking, useCancelBooking } from '@/features/bookings/api/use-bookings';
import type { Booking } from '@/features/bookings/types';
import { useContacts } from '@/features/contacts/api/use-contacts';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/data/data-table';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { PermissionGate } from '@/core/access/components/permission-gate';
import { CreateBookingForm } from './components/CreateBookingForm';

const STATUS_TONE: Record<string, 'success' | 'neutral' | 'danger' | 'info'> = {
  DRAFT: 'info',
  CONFIRMED: 'success',
  CANCELLED: 'danger',
  COMPLETED: 'neutral',
};

export function BookingsSection() {
  const { organization } = useOrganizationContext();
  const organizationId = organization?.id;
  const { data: bookings, isLoading } = useBookings(organizationId);
  const { data: contacts } = useContacts(organizationId);
  const confirmBooking = useConfirmBooking(organizationId ?? '');
  const cancelBooking = useCancelBooking(organizationId ?? '');
  const [dialogOpen, setDialogOpen] = useState(false);

  const contactName = (contactId: string) => {
    const contact = contacts?.find((c) => c.id === contactId);
    if (!contact) return contactId;
    return contact.type === 'BUSINESS'
      ? contact.companyName ?? '—'
      : `${contact.firstName ?? ''} ${contact.lastName ?? ''}`.trim() || '—';
  };

  const columns: ColumnDef<Booking, unknown>[] = [
    { id: 'contact', header: 'Contact', accessorFn: (row) => contactName(row.contactId) },
    {
      accessorKey: 'scheduledAt',
      header: 'Scheduled for',
      cell: ({ getValue }) => new Date(getValue() as string).toLocaleString(),
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
        const booking = row.original;
        return (
          <PermissionGate permission="booking:manage">
            <div className="flex justify-end gap-1.5">
              {booking.status === 'DRAFT' && (
                <Button
                  variant="ghost"
                  className="!px-2 !py-1 text-xs"
                  disabled={confirmBooking.isPending}
                  onClick={() => confirmBooking.mutate(booking.id)}
                >
                  Confirm
                </Button>
              )}
              {(booking.status === 'DRAFT' || booking.status === 'CONFIRMED') && (
                <Button
                  variant="ghost"
                  className="!px-2 !py-1 text-xs text-danger"
                  disabled={cancelBooking.isPending}
                  onClick={() => cancelBooking.mutate(booking.id)}
                >
                  Cancel
                </Button>
              )}
            </div>
          </PermissionGate>
        );
      },
    },
  ];

  return (
    <div>
      <PageHeader
        title="Bookings"
        description="Appointments and scheduled sessions across your organization."
        action={
          <PermissionGate permission="booking:create">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>New booking</Button>
              </DialogTrigger>
              <DialogContent title="Create a booking" description="Schedule a new appointment.">
                {organizationId && (
                  <CreateBookingForm organizationId={organizationId} onDone={() => setDialogOpen(false)} />
                )}
              </DialogContent>
            </Dialog>
          </PermissionGate>
        }
      />

      <DataTable
        columns={columns}
        data={bookings ?? []}
        loading={isLoading}
        searchPlaceholder="Search bookings..."
        emptyTitle="No bookings yet"
        emptyDescription="Create a booking to get started."
      />
    </div>
  );
}
