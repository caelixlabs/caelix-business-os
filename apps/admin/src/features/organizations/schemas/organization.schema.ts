import { z } from 'zod';

export const updateOrganizationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
});
export type UpdateOrganizationFormValues = z.infer<typeof updateOrganizationSchema>;
