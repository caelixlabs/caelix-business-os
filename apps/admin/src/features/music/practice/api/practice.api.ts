import { apiGet, apiPost } from '@/api/client';
import type { MusicPracticeLog } from '../types';

export const musicPracticeApi = {
  listByStudent: (organizationId: string, studentId: string) =>
    apiGet<MusicPracticeLog[]>(`/organizations/${organizationId}/music-org/practice/${studentId}`),

  create: (
    organizationId: string,
    input: {
      studentId: string;
      date?: string;
      minutes: number;
      instrument?: string;
      piece?: string;
      notes?: string;
      teacherFeedback?: string;
      rating?: number;
    },
  ) => apiPost<MusicPracticeLog>(`/organizations/${organizationId}/music-org/practice`, input),
};
