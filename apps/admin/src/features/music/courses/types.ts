export type MusicSkillLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'PROFESSIONAL';
export type MusicCourseStatus = 'ACTIVE' | 'INACTIVE';

export interface MusicCourse {
  id: string;
  organizationId: string;
  code: string;
  name: string;
  description?: string;
  instrument?: string;
  skillLevel: MusicSkillLevel;
  durationWeeks?: number;
  classDurationMinutes: number;
  status: MusicCourseStatus;
}
