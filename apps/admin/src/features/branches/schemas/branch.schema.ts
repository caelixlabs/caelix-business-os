import { z } from 'zod';

export const createBranchSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z
    .string()
    .min(1, 'Code is required')
    .regex(/^[A-Z0-9-]+$/i, 'Letters, numbers, and hyphens only'),
});
export type CreateBranchFormValues = z.infer<typeof createBranchSchema>;
