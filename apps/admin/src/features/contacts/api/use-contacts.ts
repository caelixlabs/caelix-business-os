import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { contactsApi } from './contacts.api';
import { ApiError } from '@/api/client';

export const contactKeys = {
  list: (organizationId: string) => ['contacts', organizationId] as const,
  detail: (organizationId: string, id: string) => ['contact', organizationId, id] as const,
};

export function useContacts(organizationId: string | undefined) {
  return useQuery({
    queryKey: contactKeys.list(organizationId ?? ''),
    queryFn: () => contactsApi.list(organizationId as string),
    enabled: Boolean(organizationId),
  });
}

export function useContact(organizationId: string | undefined, id: string | undefined) {
  return useQuery({
    queryKey: contactKeys.detail(organizationId ?? '', id ?? ''),
    queryFn: () => contactsApi.get(organizationId as string, id as string),
    enabled: Boolean(organizationId) && Boolean(id),
  });
}

export function useCreateContact(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Parameters<typeof contactsApi.create>[1]) =>
      contactsApi.create(organizationId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.list(organizationId) });
      toast.success('Contact added.');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Could not add contact.');
    },
  });
}

export function useUpdateContact(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { id: string; input: Parameters<typeof contactsApi.update>[2] }) =>
      contactsApi.update(organizationId, params.id, params.input),
    onSuccess: (_data, params) => {
      queryClient.invalidateQueries({ queryKey: contactKeys.list(organizationId) });
      queryClient.invalidateQueries({ queryKey: contactKeys.detail(organizationId, params.id) });
      toast.success('Contact updated.');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Could not update contact.');
    },
  });
}

export function useToggleContactStatus(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { id: string; nextStatus: 'ACTIVE' | 'ARCHIVED' }) =>
      params.nextStatus === 'ARCHIVED'
        ? contactsApi.archive(organizationId, params.id)
        : contactsApi.activate(organizationId, params.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.list(organizationId) });
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Could not update contact.');
    },
  });
}
