export type MusicSkillLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'PROFESSIONAL';
export type MusicStudentStatus = 'ACTIVE' | 'INACTIVE' | 'GRADUATED' | 'ON_HOLD';

export interface MusicStudent {
  id: string;
  organizationId: string;
  branchId?: string;
  studentNo: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  guardianName?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  instrument?: string;
  skillLevel: MusicSkillLevel;
  status: MusicStudentStatus;
  joinedAt: string;
  notes?: string;
}
