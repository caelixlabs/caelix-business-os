import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { invoicesApi } from './invoices.api';
import { ApiError } from '@/api/client';

export const invoiceKeys = {
  list: (organizationId: string, filters?: { status?: string; contactId?: string }) =>
    ['invoices', organizationId, filters ?? {}] as const,
  detail: (organizationId: string, id: string) => ['invoice', organizationId, id] as const,
  payments: (organizationId: string, id: string) => ['invoice-payments', organizationId, id] as const,
};

export function useInvoices(
  organizationId: string | undefined,
  filters?: { status?: string; contactId?: string },
) {
  return useQuery({
    queryKey: invoiceKeys.list(organizationId ?? '', filters),
    queryFn: () => invoicesApi.list(organizationId as string, filters),
    enabled: Boolean(organizationId),
  });
}

export function useInvoice(organizationId: string | undefined, id: string | undefined) {
  return useQuery({
    queryKey: invoiceKeys.detail(organizationId ?? '', id ?? ''),
    queryFn: () => invoicesApi.get(organizationId as string, id as string),
    enabled: Boolean(organizationId) && Boolean(id),
  });
}

export function useInvoicePayments(organizationId: string | undefined, id: string | undefined) {
  return useQuery({
    queryKey: invoiceKeys.payments(organizationId ?? '', id ?? ''),
    queryFn: () => invoicesApi.listPayments(organizationId as string, id as string),
    enabled: Boolean(organizationId) && Boolean(id),
  });
}

export function useCreateInvoice(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Parameters<typeof invoicesApi.create>[1]) =>
      invoicesApi.create(organizationId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices', organizationId] });
      toast.success('Invoice created.');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Could not create invoice.');
    },
  });
}

export function useIssueInvoice(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => invoicesApi.issue(organizationId, id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['invoices', organizationId] });
      queryClient.invalidateQueries({ queryKey: invoiceKeys.detail(organizationId, id) });
      toast.success('Invoice issued.');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Could not issue invoice.');
    },
  });
}

export function useVoidInvoice(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => invoicesApi.void(organizationId, id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['invoices', organizationId] });
      queryClient.invalidateQueries({ queryKey: invoiceKeys.detail(organizationId, id) });
      toast.success('Invoice voided.');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Could not void invoice.');
    },
  });
}

export function useRecordPayment(organizationId: string, invoiceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Parameters<typeof invoicesApi.recordPayment>[2]) =>
      invoicesApi.recordPayment(organizationId, invoiceId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices', organizationId] });
      queryClient.invalidateQueries({ queryKey: invoiceKeys.detail(organizationId, invoiceId) });
      queryClient.invalidateQueries({ queryKey: invoiceKeys.payments(organizationId, invoiceId) });
      toast.success('Payment recorded.');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Could not record payment.');
    },
  });
}
