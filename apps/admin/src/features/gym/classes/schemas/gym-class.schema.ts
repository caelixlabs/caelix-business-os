import { z } from 'zod';

export const weekdayValues = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'] as const;

export const createGymClassSchema = z.object({
  branchId: z.string().min(1, 'Branch is required'),
  name: z.string().min(1, 'Class name is required'),
  capacity: z.coerce.number().int().min(1).default(20),
  startDate: z.string().min(1, 'Start date is required'),
  days: z.array(z.enum(weekdayValues)).min(1, 'Pick at least one day'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
});
export type CreateGymClassFormValues = z.infer<typeof createGymClassSchema>;
