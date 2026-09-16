'use client';

import { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';

import { useOrganizationContext } from '@/contexts/organization/OrganizationContext';
import { useInvoices } from '@/features/invoices/api/use-invoices';
import type { Invoice } from '@/features/invoices/types';
import { useContacts } from '@/features/contacts/api/use-contacts';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/data/data-table';
import { StatCard } from '@/components/data/stat-card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { PermissionGate } from '@/core/access/components/permission-gate';
import { CreateInvoiceForm } from './components/CreateInvoiceForm';
import { AlertCircle, CreditCard, FileText, Wallet } from 'lucide-react';
import Link from 'next/link';

const STATUS_TONE: Record<string, 'success' | 'neutral' | 'danger' | 'info'> = {
  DRAFT: 'neutral',
  ISSUED: 'info',
  PAID: 'success',
  OVERDUE: 'danger',
  VOID: 'neutral',
};

export function InvoicesSection() {
  const { organization } = useOrganizationContext();
  const organizationId = organization?.id;
  const { data: invoices, isLoading } = useInvoices(organizationId);
  const { data: contacts } = useContacts(organizationId);
  const [dialogOpen, setDialogOpen] = useState(false);

  const contactName = (contactId: string) => {
    const contact = contacts?.find((c) => c.id === contactId);
    if (!contact) return contactId;
    return contact.type === 'BUSINESS'
      ? contact.companyName ?? '—'
      : `${contact.firstName ?? ''} ${contact.lastName ?? ''}`.trim() || '—';
  };

  const outstanding = (invoices ?? [])
    .filter((invoice) => invoice.status === 'ISSUED' || invoice.status === 'OVERDUE')
    .reduce((sum, invoice) => sum + invoice.balanceDue, 0);
  const overdueCount = invoices?.filter((invoice) => invoice.status === 'OVERDUE').length ?? 0;
  const paidThisTotal = (invoices ?? []).filter((invoice) => invoice.status === 'PAID').reduce((sum, invoice) => sum + invoice.totalAmount, 0);
  const draftCount = invoices?.filter((invoice) => invoice.status === 'DRAFT').length ?? 0;

  const columns: ColumnDef<Invoice, unknown>[] = [
    {
      accessorKey: 'invoiceNumber',
      header: 'Invoice',
      cell: ({ row }) => (
        <Link href={`/dashboard/payments/${row.original.id}`} className="font-mono text-xs font-medium text-text hover:text-accent">
          {row.original.invoiceNumber}
        </Link>
      ),
    },
    { id: 'contact', header: 'Contact', accessorFn: (row) => contactName(row.contactId) },
    {
      accessorKey: 'totalAmount',
      header: 'Total',
      cell: ({ row }) => `${row.original.currency} ${row.original.totalAmount.toFixed(2)}`,
    },
    {
      accessorKey: 'balanceDue',
      header: 'Balance due',
      cell: ({ row }) => (
        <span className={row.original.balanceDue > 0 ? 'font-medium text-danger' : 'text-text-secondary'}>
          {row.original.currency} {row.original.balanceDue.toFixed(2)}
        </span>
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
  ];

  return (
    <div>
      <PageHeader
        title="Invoices"
        description="Bill contacts, track balances, and record payments."
        action={
          <PermissionGate permission="invoice:create">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>New invoice</Button>
              </DialogTrigger>
              <DialogContent title="Create an invoice" description="Bill a contact for products or services." className="max-w-2xl">
                {organizationId && <CreateInvoiceForm organizationId={organizationId} onDone={() => setDialogOpen(false)} />}
              </DialogContent>
            </Dialog>
          </PermissionGate>
        }
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-4">
        <StatCard title="Outstanding" value={`₹${outstanding.toFixed(2)}`} description="issued + overdue" icon={Wallet} />
        <StatCard title="Overdue" value={overdueCount} description="invoices" icon={AlertCircle} />
        <StatCard title="Collected" value={`₹${paidThisTotal.toFixed(2)}`} description="all time" icon={CreditCard} />
        <StatCard title="Drafts" value={draftCount} description="not yet issued" icon={FileText} />
      </div>

      <DataTable
        columns={columns}
        data={invoices ?? []}
        loading={isLoading}
        searchPlaceholder="Search invoices..."
        emptyTitle="No invoices yet"
        emptyDescription="Create your first invoice to start billing."
      />
    </div>
  );
}
