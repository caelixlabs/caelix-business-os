'use client';

import { useOrganizationContext } from '@/contexts/organization/OrganizationContext';
import { useInvoice, useInvoicePayments, useIssueInvoice, useVoidInvoice } from '@/features/invoices/api/use-invoices';
import { useContacts } from '@/features/contacts/api/use-contacts';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { EmptyState } from '@/components/ui/empty-state';
import { PermissionGate } from '@/core/access/components/permission-gate';
import { RecordPaymentDialog } from './components/RecordPaymentDialog';

const STATUS_TONE: Record<string, 'success' | 'neutral' | 'danger' | 'info'> = {
  DRAFT: 'neutral',
  ISSUED: 'info',
  PAID: 'success',
  OVERDUE: 'danger',
  VOID: 'neutral',
};

export function InvoiceDetailView({ invoiceId }: { invoiceId: string }) {
  const { organization } = useOrganizationContext();
  const organizationId = organization?.id;

  const { data: invoice, isLoading } = useInvoice(organizationId, invoiceId);
  const { data: payments } = useInvoicePayments(organizationId, invoiceId);
  const { data: contacts } = useContacts(organizationId);
  const issueInvoice = useIssueInvoice(organizationId ?? '');
  const voidInvoice = useVoidInvoice(organizationId ?? '');

  if (isLoading || !invoice) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  const contact = contacts?.find((c) => c.id === invoice.contactId);
  const contactName = contact
    ? contact.type === 'BUSINESS'
      ? contact.companyName ?? '—'
      : `${contact.firstName ?? ''} ${contact.lastName ?? ''}`.trim() || '—'
    : invoice.contactId;

  return (
    <div>
      <PageHeader
        title={invoice.invoiceNumber}
        description={`Billed to ${contactName}`}
        action={
          <div className="flex items-center gap-2">
            <Badge tone={STATUS_TONE[invoice.status] ?? 'neutral'}>{invoice.status.toLowerCase()}</Badge>
            <PermissionGate permission="invoice:manage">
              {invoice.status === 'DRAFT' && (
                <Button variant="secondary" disabled={issueInvoice.isPending} onClick={() => issueInvoice.mutate(invoiceId)}>
                  Issue
                </Button>
              )}
              {(invoice.status === 'DRAFT' || invoice.status === 'ISSUED' || invoice.status === 'OVERDUE') && (
                <Button variant="ghost" className="text-danger" disabled={voidInvoice.isPending} onClick={() => voidInvoice.mutate(invoiceId)}>
                  Void
                </Button>
              )}
            </PermissionGate>
            {(invoice.status === 'ISSUED' || invoice.status === 'OVERDUE') && (
              <PermissionGate permission="payment:record">
                <RecordPaymentDialog organizationId={organizationId ?? ''} invoiceId={invoiceId} balanceDue={invoice.balanceDue} />
              </PermissionGate>
            )}
          </div>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <Card className="p-4">
          <p className="text-xs font-medium text-text-secondary">Total</p>
          <p className="mt-1 text-sm font-semibold text-text">
            {invoice.currency} {invoice.totalAmount.toFixed(2)}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-text-secondary">Paid</p>
          <p className="mt-1 text-sm font-semibold text-text">
            {invoice.currency} {invoice.amountPaid.toFixed(2)}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-text-secondary">Balance due</p>
          <p className={`mt-1 text-sm font-semibold ${invoice.balanceDue > 0 ? 'text-danger' : 'text-text'}`}>
            {invoice.currency} {invoice.balanceDue.toFixed(2)}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-text-secondary">Due date</p>
          <p className="mt-1 text-sm font-semibold text-text">
            {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : '—'}
          </p>
        </Card>
      </div>

      <Card className="mb-6 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-canvas/70">
            <tr>
              <th className="px-4 py-2.5 text-xs font-semibold text-text-secondary">Description</th>
              <th className="px-4 py-2.5 text-xs font-semibold text-text-secondary">Qty</th>
              <th className="px-4 py-2.5 text-xs font-semibold text-text-secondary">Unit price</th>
              <th className="px-4 py-2.5 text-xs font-semibold text-text-secondary">Tax</th>
              <th className="px-4 py-2.5 text-right text-xs font-semibold text-text-secondary">Line total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70">
            {invoice.lines.map((line) => (
              <tr key={line.id}>
                <td className="px-4 py-2.5">{line.description}</td>
                <td className="px-4 py-2.5">{line.quantity}</td>
                <td className="px-4 py-2.5">
                  {invoice.currency} {line.unitPrice.toFixed(2)}
                </td>
                <td className="px-4 py-2.5">{line.taxRate ? `${line.taxRate}%` : '—'}</td>
                <td className="px-4 py-2.5 text-right font-medium">
                  {invoice.currency} {line.lineTotal.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-border">
              <td colSpan={4} className="px-4 py-2 text-right text-xs text-text-secondary">
                Subtotal
              </td>
              <td className="px-4 py-2 text-right text-xs text-text-secondary">
                {invoice.currency} {invoice.subtotal.toFixed(2)}
              </td>
            </tr>
            {invoice.discountAmount > 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-2 text-right text-xs text-text-secondary">
                  Discount
                </td>
                <td className="px-4 py-2 text-right text-xs text-text-secondary">
                  −{invoice.currency} {invoice.discountAmount.toFixed(2)}
                </td>
              </tr>
            )}
            <tr>
              <td colSpan={4} className="px-4 py-2 text-right text-xs text-text-secondary">
                Tax
              </td>
              <td className="px-4 py-2 text-right text-xs text-text-secondary">
                {invoice.currency} {invoice.taxAmount.toFixed(2)}
              </td>
            </tr>
            <tr className="border-t border-border">
              <td colSpan={4} className="px-4 py-2.5 text-right text-sm font-semibold text-text">
                Total
              </td>
              <td className="px-4 py-2.5 text-right text-sm font-semibold text-text">
                {invoice.currency} {invoice.totalAmount.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </Card>

      <div>
        <p className="mb-2 text-sm font-semibold text-text">Payment history</p>
        {!payments || payments.length === 0 ? (
          <EmptyState title="No payments yet" description="Payments recorded against this invoice will appear here." />
        ) : (
          <div className="space-y-2">
            {payments.map((payment) => (
              <Card key={payment.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium text-text">
                    {invoice.currency} {payment.amount.toFixed(2)}
                  </p>
                  <p className="mt-0.5 text-xs text-text-secondary">
                    {new Date(payment.paidAt).toLocaleString()}
                    {payment.referenceId && ` · Ref: ${payment.referenceId}`}
                  </p>
                </div>
                <Badge tone="info">{payment.paymentMethod.replace('_', ' ').toLowerCase()}</Badge>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
