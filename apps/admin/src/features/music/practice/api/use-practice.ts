import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { musicPracticeApi } from './practice.api';
import { ApiError } from '@/api/client';

export const musicPracticeKeys = {
  byStudent: (organizationId: string, studentId: string) =>
    ['music-practice', organizationId, studentId] as const,
};

export function useMusicPracticeLogs(organizationId: string | undefined, studentId: string | undefined) {
  return useQuery({
    queryKey: musicPracticeKeys.byStudent(organizationId ?? '', studentId ?? ''),
    queryFn: () => musicPracticeApi.listByStudent(organizationId as string, studentId as string),
    enabled: Boolean(organizationId) && Boolean(studentId),
  });
}

export function useCreateMusicPracticeLog(organizationId: string, studentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Omit<Parameters<typeof musicPracticeApi.create>[1], 'studentId'>) =>
      musicPracticeApi.create(organizationId, { ...input, studentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: musicPracticeKeys.byStudent(organizationId, studentId) });
      toast.success('Practice log added.');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Could not add practice log.');
    },
  });
}
