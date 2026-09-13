import { z } from 'zod';
import { optionalNumber } from '@/lib/zod-helpers';

export const musicSkillLevelValues = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'PROFESSIONAL'] as const;

export const createCourseSchema = z.object({
  code: z.string().min(1, 'Course code is required'),
  name: z.string().min(1, 'Course name is required'),
  description: z.string().optional(),
  instrument: z.string().optional(),
  skillLevel: z.enum(musicSkillLevelValues).optional(),
  durationWeeks: optionalNumber(z.coerce.number().int().positive()),
  classDurationMinutes: optionalNumber(z.coerce.number().int().positive()),
});
export type CreateCourseFormValues = z.infer<typeof createCourseSchema>;
