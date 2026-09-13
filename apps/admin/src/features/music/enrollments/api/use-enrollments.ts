import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { musicEnrollmentsApi } from './enrollments.api';
import { ApiError } from '@/api/client';

export const musicEnrollmentKeys = {
  list: (organizationId: string, filters?: { batchId?: string; studentId?: string }) =>
    ['music-enrollments', organizationId, filters ?? {}] as const,
};

export function useMusicEnrollments(
  organizationId: string | undefined,
  filters?: { batchId?: string; studentId?: string },
) {
  return useQuery({
    queryKey: musicEnrollmentKeys.list(organizationId ?? '', filters),
    queryFn: () => musicEnrollmentsApi.list(organizationId as string, filters),
    enabled: Boolean(organizationId),
  });
}

export function useCreateMusicEnrollment(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Parameters<typeof musicEnrollmentsApi.create>[1]) =>
      musicEnrollmentsApi.create(organizationId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['music-enrollments', organizationId] });
      toast.success('Student enrolled.');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Could not enroll student.');
    },
  });
}

export function useUpdateMusicEnrollmentStatus(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { id: string; status: string }) =>
      musicEnrollmentsApi.updateStatus(organizationId, params.id, params.status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['music-enrollments', organizationId] });
      toast.success('Enrollment updated.');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Could not update enrollment.');
    },
  });
}
