import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ApiError } from '@/api/client';
import { signaturesApi, type RequestSignatureInput } from './signatures.api';

const listKey = (organizationId: string) => ['signatures', organizationId] as const;

export const useSignatures = (organizationId: string | undefined) =>
  useQuery({
    queryKey: listKey(organizationId ?? ''),
    queryFn: () => signaturesApi.list(organizationId as string),
    enabled: Boolean(organizationId),
  });

const onError = (error: unknown) => toast.error(error instanceof ApiError ? error.message : 'Something went wrong.');

export function useRequestSignature(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: RequestSignatureInput) => signaturesApi.create(organizationId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listKey(organizationId) });
      toast.success('Signature requested — the signer has been emailed.');
    },
    onError,
  });
}

export function useCancelSignature(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => signaturesApi.cancel(organizationId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listKey(organizationId) });
      toast.success('Request cancelled.');
    },
    onError,
  });
}

export async function copySigningLink(organizationId: string, id: string) {
  try {
    const { signingUrl } = await signaturesApi.link(organizationId, id);
    await navigator.clipboard.writeText(signingUrl);
    toast.success('Signing link copied.');
  } catch (error) {
    onError(error);
  }
}
