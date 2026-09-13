import { z } from 'zod';

export const createBookingSchema = z.object({
  contactId: z.string().min(1, 'Contact is required'),
  branchId: z.string().optional(),
  scheduledAt: z.string().min(1, 'Date and time are required'),
  notes: z.string().optional(),
});
export type CreateBookingFormValues = z.infer<typeof createBookingSchema>;
