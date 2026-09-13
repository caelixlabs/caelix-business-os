export type MusicEnrollmentStatus = 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';

export interface MusicEnrollment {
  id: string;
  organizationId: string;
  studentId: string;
  batchId: string;
  enrolledAt: string;
  feeAmount: number;
  discountAmount: number;
  status: MusicEnrollmentStatus;
  notes?: string;
}
