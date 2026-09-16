import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { gymClassesApi } from './gym-classes.api';
import { ApiError } from '@/api/client';

export const gymClassKeys = {
  list: (organizationId: string) => ['gym-classes', organizationId] as const,
};

export function useGymClasses(organizationId: string | undefined) {
  return useQuery({
    queryKey: gymClassKeys.list(organizationId ?? ''),
    queryFn: () => gymClassesApi.list(organizationId as string),
    enabled: Boolean(organizationId),
  });
}

export function useCreateGymClass(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Parameters<typeof gymClassesApi.create>[1]) =>
      gymClassesApi.create(organizationId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gymClassKeys.list(organizationId) });
      toast.success('Class created.');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Could not create class.');
    },
  });
}
