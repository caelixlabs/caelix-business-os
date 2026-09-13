export interface MusicPracticeLog {
  id: string;
  organizationId: string;
  studentId: string;
  date: string;
  minutes: number;
  instrument?: string;
  piece?: string;
  notes?: string;
  teacherFeedback?: string;
  rating?: number;
}
