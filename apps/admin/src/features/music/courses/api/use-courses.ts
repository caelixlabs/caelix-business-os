import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { musicCoursesApi } from './courses.api';
import { ApiError } from '@/api/client';

export const musicCourseKeys = {
  list: (organizationId: string) => ['music-courses', organizationId] as const,
  detail: (organizationId: string, id: string) => ['music-course', organizationId, id] as const,
};

export function useMusicCourses(organizationId: string | undefined) {
  return useQuery({
    queryKey: musicCourseKeys.list(organizationId ?? ''),
    queryFn: () => musicCoursesApi.list(organizationId as string),
    enabled: Boolean(organizationId),
  });
}

export function useMusicCourse(organizationId: string | undefined, id: string | undefined) {
  return useQuery({
    queryKey: musicCourseKeys.detail(organizationId ?? '', id ?? ''),
    queryFn: () => musicCoursesApi.get(organizationId as string, id as string),
    enabled: Boolean(organizationId) && Boolean(id),
  });
}

export function useCreateMusicCourse(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Parameters<typeof musicCoursesApi.create>[1]) =>
      musicCoursesApi.create(organizationId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: musicCourseKeys.list(organizationId) });
      toast.success('Course created.');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Could not create course.');
    },
  });
}

export function useUpdateMusicCourse(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { id: string; input: Parameters<typeof musicCoursesApi.update>[2] }) =>
      musicCoursesApi.update(organizationId, params.id, params.input),
    onSuccess: (_data, params) => {
      queryClient.invalidateQueries({ queryKey: musicCourseKeys.list(organizationId) });
      queryClient.invalidateQueries({ queryKey: musicCourseKeys.detail(organizationId, params.id) });
      toast.success('Course updated.');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Could not update course.');
    },
  });
}
