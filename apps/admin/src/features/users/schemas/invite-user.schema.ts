import { z } from 'zod';

export const inviteUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Enter a valid email'),
  temporaryPassword: z.string().min(8, 'At least 8 characters'),
});
export type InviteUserFormValues = z.infer<typeof inviteUserSchema>;
