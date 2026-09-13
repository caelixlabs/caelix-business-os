export type MusicBatchStatus = 'PLANNED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'] as const;
export type Weekday = (typeof WEEKDAYS)[number];

export interface MusicBatch {
  id: string;
  organizationId: string;
  branchId: string;
  courseId: string;
  teacherUserId?: string;
  name: string;
  capacity: number;
  startDate: string;
  endDate?: string;
  days: string[];
  startTime: string;
  endTime: string;
  status: MusicBatchStatus;
}
