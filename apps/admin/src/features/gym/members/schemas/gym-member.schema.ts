import { z } from 'zod';

export const createGymMemberSchema = z.object({
  memberNo: z.string().min(1, 'Member number is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  branchId: z.string().optional(),
  email: z.string().email('Enter a valid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  notes: z.string().optional(),
});
export type CreateGymMemberFormValues = z.infer<typeof createGymMemberSchema>;
