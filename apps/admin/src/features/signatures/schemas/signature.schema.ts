import { z } from 'zod';

export const requestSignatureSchema = z.object({
  contactId: z.string().optional(),
  signerName: z.string().min(1, 'Enter the signer’s name'),
  signerEmail: z.string().email('Enter a valid email'),
  title: z.string().min(1, 'Give the document a title'),
  body: z.string().min(1, 'Paste or write the agreement text'),
  expiresInDays: z.coerce.number().int().min(1).max(90),
});
export type RequestSignatureFormValues = z.infer<typeof requestSignatureSchema>;
