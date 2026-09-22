'use client';

import { useState } from 'react';
import type { CellContext, ColumnDef } from '@tanstack/react-table';
import { Copy, XCircle } from 'lucide-react';

import { useOrganizationContext } from '@/contexts/organization/OrganizationContext';
import { copySigningLink, useCancelSignature, useSignatures } from '@/features/signatures/api/use-signatures';
import type { SignatureRequest, SignatureStatus } from '@/features/signatures/types';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/data/data-table';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { PermissionGate } from '@/core/access/components/permission-gate';
import { formatDate } from '@/lib/format';
import { RequestSignatureForm } from './components/RequestSignatureForm';

const STATUS_TONE: Record<SignatureStatus, 'success' | 'info' | 'danger' | 'neutral'> = {
  SIGNED: 'success',
  PENDING: 'info',
  DECLINED: 'danger',
  EXPIRED: 'neutral',
  CANCELLED: 'neutral',
};

export function SignaturesSection() {
  const { organization } = useOrganizationContext();
  const organizationId = organization?.id;
  const { data: requests, isLoading } = useSignatures(organizationId);
  const cancel = useCancelSignature(organizationId ?? '');
  const [open, setOpen] = useState(false);

  const columns: ColumnDef<SignatureRequest, unknown>[] = [
    { accessorKey: 'title', header: 'Document' },
    { id: 'signer', header: 'Signer', accessorFn: (row) => `${row.signerName} · ${row.signerEmail}` },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => <Badge tone={STATUS_TONE[getValue() as SignatureStatus]}>{(getValue() as string).toLowerCase()}</Badge>,
    },
    { accessorKey: 'createdAt', header: 'Sent', cell: ({ getValue }) => formatDate(getValue() as string, 'relative') },
    {
      id: 'outcome',
      header: 'Signed / expires',
      cell: ({ row }) =>
        row.original.signedAt
          ? formatDate(row.original.signedAt)
          : row.original.status === 'PENDING'
            ? `Expires ${formatDate(row.original.expiresAt)}`
            : '—',
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }: CellContext<SignatureRequest, unknown>) =>
        row.original.status === 'PENDING' && (
          <PermissionGate permission="signature:manage">
            <div className="flex gap-3 text-text-secondary">
              <button
                type="button"
                aria-label={`Copy signing link for ${row.original.title}`}
                title="Copy signing link"
                onClick={() => organizationId && copySigningLink(organizationId, row.original.id)}
                className="hover:text-text"
              >
                <Copy className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label={`Cancel ${row.original.title}`}
                title="Cancel request"
                onClick={() => cancel.mutate(row.original.id)}
                className="hover:text-danger"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </div>
          </PermissionGate>
        ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="E-signature"
        description="Send an agreement, consent form or contract for signing — the signer needs no account, and every signature is recorded."
        action={
          <PermissionGate permission="signature:manage">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>Request signature</Button>
              </DialogTrigger>
              <DialogContent title="Request a signature" description="We'll email the signer a private link to review and sign.">
                {organizationId && <RequestSignatureForm organizationId={organizationId} onDone={() => setOpen(false)} />}
              </DialogContent>
            </Dialog>
          </PermissionGate>
        }
      />

      <DataTable
        columns={columns}
        data={requests ?? []}
        loading={isLoading}
        searchPlaceholder="Search signature requests..."
        emptyTitle="Nothing sent for signature yet"
        emptyDescription="Request a signature to get consent forms and agreements signed without paper."
      />
    </div>
  );
}
