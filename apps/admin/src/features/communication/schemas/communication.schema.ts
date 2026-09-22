import { z } from 'zod';

const channel = z.enum(['EMAIL', 'SMS', 'WHATSAPP']);

export const sendMessageSchema = z.object({
  channel,
  contactId: z.string().min(1, 'Choose who to message'),
  subject: z.string().optional(),
  body: z.string().min(1, 'Write a message'),
});
export type SendMessageFormValues = z.infer<typeof sendMessageSchema>;

export const createTemplateSchema = z.object({
  name: z.string().min(1, 'Give the template a name'),
  channel,
  subject: z.string().optional(),
  body: z.string().min(1, 'Write the message'),
});
export type CreateTemplateFormValues = z.infer<typeof createTemplateSchema>;
