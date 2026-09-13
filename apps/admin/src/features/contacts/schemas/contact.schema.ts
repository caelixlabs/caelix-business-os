import { z } from 'zod';

export const contactTypeValues = ['PERSON', 'BUSINESS'] as const;

export const createContactSchema = z
  .object({
    type: z.enum(contactTypeValues),
    branchId: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    companyName: z.string().optional(),
    email: z.string().email('Enter a valid email').optional().or(z.literal('')),
    phone: z.string().optional(),
    notes: z.string().optional(),
  })
  .refine(
    (values) =>
      values.type === 'BUSINESS'
        ? Boolean(values.companyName)
        : Boolean(values.firstName || values.lastName),
    {
      message: 'Enter a name',
      path: ['firstName'],
    },
  );
export type CreateContactFormValues = z.infer<typeof createContactSchema>;

export const editContactSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  companyName: z.string().optional(),
  email: z.string().email('Enter a valid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  notes: z.string().optional(),
});
export type EditContactFormValues = z.infer<typeof editContactSchema>;
