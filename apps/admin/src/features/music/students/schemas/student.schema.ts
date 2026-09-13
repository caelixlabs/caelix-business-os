import { z } from 'zod';

export const musicSkillLevelValues = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'PROFESSIONAL'] as const;
export const musicStudentStatusValues = ['ACTIVE', 'INACTIVE', 'GRADUATED', 'ON_HOLD'] as const;

export const createStudentSchema = z.object({
  studentNo: z.string().min(1, 'Student number is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  branchId: z.string().optional(),
  email: z.string().email('Enter a valid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  instrument: z.string().optional(),
  skillLevel: z.enum(musicSkillLevelValues).optional(),
  guardianName: z.string().optional(),
  guardianPhone: z.string().optional(),
  guardianEmail: z.string().email('Enter a valid email').optional().or(z.literal('')),
  notes: z.string().optional(),
});
export type CreateStudentFormValues = z.infer<typeof createStudentSchema>;

export const editStudentSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Enter a valid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  instrument: z.string().optional(),
  skillLevel: z.enum(musicSkillLevelValues).optional(),
  status: z.enum(musicStudentStatusValues).optional(),
  guardianName: z.string().optional(),
  guardianPhone: z.string().optional(),
  guardianEmail: z.string().email('Enter a valid email').optional().or(z.literal('')),
  notes: z.string().optional(),
});
export type EditStudentFormValues = z.infer<typeof editStudentSchema>;
