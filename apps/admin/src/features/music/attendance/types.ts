export type MusicAttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

export interface MusicAttendanceRecord {
  id: string;
  organizationId: string;
  studentId: string;
  batchId: string;
  date: string;
  status: MusicAttendanceStatus;
  notes?: string;
}
