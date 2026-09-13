import { z } from 'zod';
import { WEEKDAYS } from '../types';
import { optionalNumber } from '@/lib/zod-helpers';

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const createBatchSchema = z
  .object({
    branchId: z.string().min(1, 'Branch is required'),
    courseId: z.string().min(1, 'Course is required'),
    teacherUserId: z.string().optional(),
    name: z.string().min(1, 'Batch name is required'),
    capacity: optionalNumber(z.coerce.number().int().positive()),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().optional(),
    days: z.array(z.enum(WEEKDAYS)).min(1, 'Select at least one day'),
    startTime: z.string().regex(TIME_PATTERN, 'Use HH:mm format'),
    endTime: z.string().regex(TIME_PATTERN, 'Use HH:mm format'),
  })
  .refine((values) => values.startTime < values.endTime, {
    message: 'Start time must be before end time',
    path: ['endTime'],
  });
export type CreateBatchFormValues = z.infer<typeof createBatchSchema>;
