import { z } from 'zod';
import { optionalNumber } from '@/lib/zod-helpers';

export const createPracticeLogSchema = z.object({
  date: z.string().optional(),
  minutes: z.coerce.number().int().min(1, 'Enter minutes practiced'),
  instrument: z.string().optional(),
  piece: z.string().optional(),
  notes: z.string().optional(),
  teacherFeedback: z.string().optional(),
  rating: optionalNumber(z.coerce.number().int().min(1).max(5)),
});
export type CreatePracticeLogFormValues = z.infer<typeof createPracticeLogSchema>;
