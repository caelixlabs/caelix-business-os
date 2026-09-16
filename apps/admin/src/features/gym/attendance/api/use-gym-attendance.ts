import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { gymAttendanceApi } from './gym-attendance.api';
import { ApiError } from '@/api/client';

export const gymAttendanceKeys = {
  byClass: (organizationId: string, classId: string, date: string) =>
    ['gym-attendance', organizationId, classId, date] as const,
};

export function useGymAttendanceByClass(
  organizationId: string | undefined,
  classId: string | undefined,
  date: string,
) {
  return useQuery({
    queryKey: gymAttendanceKeys.byClass(organizationId ?? '', classId ?? '', date),
    queryFn: () => gymAttendanceApi.listByClass(organizationId as string, classId as string, date),
    enabled: Boolean(organizationId && classId && date),
  });
}

export function useMarkGymAttendance(organizationId: string, classId: string, date: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Parameters<typeof gymAttendanceApi.mark>[1]) =>
      gymAttendanceApi.mark(organizationId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gymAttendanceKeys.byClass(organizationId, classId, date) });
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Could not mark attendance.');
    },
  });
}
