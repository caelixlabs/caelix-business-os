import { z } from 'zod';
import { optionalNumber } from '@/lib/zod-helpers';

export const createEnrollmentSchema = z.object({
  studentId: z.string().min(1, 'Student is required'),
  batchId: z.string().min(1, 'Batch is required'),
  feeAmount: optionalNumber(z.coerce.number().min(0)),
  discountAmount: optionalNumber(z.coerce.number().min(0)),
  notes: z.string().optional(),
});
export type CreateEnrollmentFormValues = z.infer<typeof createEnrollmentSchema>;
