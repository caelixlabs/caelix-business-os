import { z } from 'zod';

export const createMembershipPlanSchema = z.object({
  name: z.string().min(1, 'Plan name is required'),
  description: z.string().optional(),
  price: z.coerce.number().positive('Price must be greater than 0'),
  durationDays: z.coerce.number().int().min(1, 'Duration is required'),
  sessionsIncluded: z.coerce.number().int().min(1).optional(),
});
export type CreateMembershipPlanFormValues = z.infer<typeof createMembershipPlanSchema>;

export const subscribeMemberSchema = z.object({
  contactId: z.string().min(1, 'Member is required'),
  planId: z.string().min(1, 'Plan is required'),
  autoRenew: z.boolean().optional(),
});
export type SubscribeMemberFormValues = z.infer<typeof subscribeMemberSchema>;
