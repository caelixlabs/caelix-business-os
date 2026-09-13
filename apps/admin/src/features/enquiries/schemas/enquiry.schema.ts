import { z } from 'zod';

export const enquirySourceValues = [
  'WEBSITE',
  'PHONE',
  'EMAIL',
  'WALK_IN',
  'REFERRAL',
  'SOCIAL_MEDIA',
  'OTHER',
] as const;

export const createEnquirySchema = z.object({
  contactId: z.string().min(1, 'Contact is required'),
  branchId: z.string().optional(),
  source: z.enum(enquirySourceValues),
  subject: z.string().min(1, 'Subject is required'),
  description: z.string().optional(),
});
export type CreateEnquiryFormValues = z.infer<typeof createEnquirySchema>;
