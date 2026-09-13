import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { musicAttendanceApi } from './attendance.api';
import { ApiError } from '@/api/client';

export const musicAttendanceKeys = {
  byBatch: (organizationId: string, batchId: string, date: string) =>
    ['music-attendance', 'batch', organizationId, batchId, date] as const,
  byStudent: (organizationId: string, studentId: string) =>
    ['music-attendance', 'student', organizationId, studentId] as const,
};

export function useMusicAttendanceByBatch(
  organizationId: string | undefined,
  batchId: string | undefined,
  date: string,
) {
  return useQuery({
    queryKey: musicAttendanceKeys.byBatch(organizationId ?? '', batchId ?? '', date),
    queryFn: () => musicAttendanceApi.listByBatch(organizationId as string, batchId as string, date),
    enabled: Boolean(organizationId) && Boolean(batchId) && Boolean(date),
  });
}

export function useMusicAttendanceByStudent(organizationId: string | undefined, studentId: string | undefined) {
  return useQuery({
    queryKey: musicAttendanceKeys.byStudent(organizationId ?? '', studentId ?? ''),
    queryFn: () => musicAttendanceApi.listByStudent(organizationId as string, studentId as string),
    enabled: Boolean(organizationId) && Boolean(studentId),
  });
}

export function useMarkMusicAttendance(organizationId: string, batchId: string, date: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Parameters<typeof musicAttendanceApi.mark>[1]) =>
      musicAttendanceApi.mark(organizationId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: musicAttendanceKeys.byBatch(organizationId, batchId, date) });
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Could not mark attendance.');
    },
  });
}
