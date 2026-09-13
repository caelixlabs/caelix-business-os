import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { musicStudentsApi } from './students.api';
import { ApiError } from '@/api/client';

export const musicStudentKeys = {
  list: (organizationId: string) => ['music-students', organizationId] as const,
  detail: (organizationId: string, id: string) => ['music-student', organizationId, id] as const,
};

export function useMusicStudents(organizationId: string | undefined) {
  return useQuery({
    queryKey: musicStudentKeys.list(organizationId ?? ''),
    queryFn: () => musicStudentsApi.list(organizationId as string),
    enabled: Boolean(organizationId),
  });
}

export function useMusicStudent(organizationId: string | undefined, id: string | undefined) {
  return useQuery({
    queryKey: musicStudentKeys.detail(organizationId ?? '', id ?? ''),
    queryFn: () => musicStudentsApi.get(organizationId as string, id as string),
    enabled: Boolean(organizationId) && Boolean(id),
  });
}

export function useCreateMusicStudent(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Parameters<typeof musicStudentsApi.create>[1]) =>
      musicStudentsApi.create(organizationId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: musicStudentKeys.list(organizationId) });
      toast.success('Student added.');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Could not add student.');
    },
  });
}

export function useUpdateMusicStudent(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { id: string; input: Parameters<typeof musicStudentsApi.update>[2] }) =>
      musicStudentsApi.update(organizationId, params.id, params.input),
    onSuccess: (_data, params) => {
      queryClient.invalidateQueries({ queryKey: musicStudentKeys.list(organizationId) });
      queryClient.invalidateQueries({ queryKey: musicStudentKeys.detail(organizationId, params.id) });
      toast.success('Student updated.');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Could not update student.');
    },
  });
}
