import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { enquiriesApi } from './enquiries.api';
import { ApiError } from '@/api/client';

export const enquiryKeys = {
  list: (organizationId: string) => ['enquiries', organizationId] as const,
};

export function useEnquiries(organizationId: string | undefined) {
  return useQuery({
    queryKey: enquiryKeys.list(organizationId ?? ''),
    queryFn: () => enquiriesApi.list(organizationId as string),
    enabled: Boolean(organizationId),
  });
}

export function useCreateEnquiry(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Parameters<typeof enquiriesApi.create>[1]) =>
      enquiriesApi.create(organizationId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: enquiryKeys.list(organizationId) });
      toast.success('Enquiry logged.');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Could not log enquiry.');
    },
  });
}

export function useUpdateEnquiryStatus(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { id: string; status: string }) =>
      enquiriesApi.updateStatus(organizationId, params.id, params.status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: enquiryKeys.list(organizationId) });
      toast.success('Enquiry updated.');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Could not update enquiry.');
    },
  });
}

export function useAssignEnquiry(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { id: string; userId: string }) =>
      enquiriesApi.assign(organizationId, params.id, params.userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: enquiryKeys.list(organizationId) });
      toast.success('Enquiry assigned.');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Could not assign enquiry.');
    },
  });
}
