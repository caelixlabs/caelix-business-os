import { z } from 'zod';
import { industryTypeSchema } from '@/core/industry/industry.schema';

export const loginSchema = z.object({
  organizationSlug: z
    .string()
    .min(1, 'Organization is required')
    .regex(/^[a-z0-9-]+$/i, 'Use letters, numbers, and hyphens only'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

export const createOrganizationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Lowercase letters, numbers, and hyphens only'),
  industry: industryTypeSchema,
});
export type CreateOrganizationFormValues = z.infer<typeof createOrganizationSchema>;

export const registerOwnerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});
export type RegisterOwnerFormValues = z.infer<typeof registerOwnerSchema>;
