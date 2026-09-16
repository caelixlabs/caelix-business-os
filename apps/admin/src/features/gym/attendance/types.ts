export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

export interface GymAttendanceRecord {
  id: string;
  contactId: string;
  context: string;
  contextId: string;
  date: string;
  status: AttendanceStatus;
  notes?: string;
}
