import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { musicBatchesApi } from './batches.api';
import { ApiError } from '@/api/client';

export const musicBatchKeys = {
  list: (organizationId: string, filters?: { courseId?: string; teacherUserId?: string }) =>
    ['music-batches', organizationId, filters ?? {}] as const,
  detail: (organizationId: string, id: string) => ['music-batch', organizationId, id] as const,
};

export function useMusicBatches(
  organizationId: string | undefined,
  filters?: { courseId?: string; teacherUserId?: string },
) {
  return useQuery({
    queryKey: musicBatchKeys.list(organizationId ?? '', filters),
    queryFn: () => musicBatchesApi.list(organizationId as string, filters),
    enabled: Boolean(organizationId),
  });
}

export function useMusicBatch(organizationId: string | undefined, id: string | undefined) {
  return useQuery({
    queryKey: musicBatchKeys.detail(organizationId ?? '', id ?? ''),
    queryFn: () => musicBatchesApi.get(organizationId as string, id as string),
    enabled: Boolean(organizationId) && Boolean(id),
  });
}

export function useCreateMusicBatch(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Parameters<typeof musicBatchesApi.create>[1]) =>
      musicBatchesApi.create(organizationId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['music-batches', organizationId] });
      toast.success('Batch created.');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Could not create batch.');
    },
  });
}

export function useUpdateMusicBatch(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { id: string; input: Parameters<typeof musicBatchesApi.update>[2] }) =>
      musicBatchesApi.update(organizationId, params.id, params.input),
    onSuccess: (_data, params) => {
      queryClient.invalidateQueries({ queryKey: ['music-batches', organizationId] });
      queryClient.invalidateQueries({ queryKey: musicBatchKeys.detail(organizationId, params.id) });
      toast.success('Batch updated.');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Could not update batch.');
    },
  });
}
