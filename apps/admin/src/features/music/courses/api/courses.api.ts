import { apiGet, apiPatch, apiPost } from '@/api/client';
import type { MusicCourse } from '../types';

export const musicCoursesApi = {
  list: (organizationId: string) =>
    apiGet<MusicCourse[]>(`/organizations/${organizationId}/music-org/courses`),

  get: (organizationId: string, id: string) =>
    apiGet<MusicCourse>(`/organizations/${organizationId}/music-org/courses/${id}`),

  create: (
    organizationId: string,
    input: {
      code: string;
      name: string;
      description?: string;
      instrument?: string;
      skillLevel?: string;
      durationWeeks?: number;
      classDurationMinutes?: number;
    },
  ) => apiPost<MusicCourse>(`/organizations/${organizationId}/music-org/courses`, input),

  update: (
    organizationId: string,
    id: string,
    input: {
      name?: string;
      description?: string;
      instrument?: string;
      skillLevel?: string;
      durationWeeks?: number;
      classDurationMinutes?: number;
      status?: string;
    },
  ) => apiPatch<MusicCourse>(`/organizations/${organizationId}/music-org/courses/${id}`, input),
};
