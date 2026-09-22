import { z } from 'zod';

export const createAutomationSchema = z
  .object({
    name: z.string().min(1, 'Give the rule a name'),
    trigger: z.string().min(1, 'Choose a trigger'),
    conditionField: z.string().optional(),
    conditionValue: z.string().optional(),
    actionType: z.enum(['NOTIFY_ADMINS', 'SEND_EMAIL_TO_CONTACT', 'SEND_SMS_TO_CONTACT', 'SEND_WHATSAPP_TO_CONTACT']),
    heading: z.string().optional(),
    content: z.string().min(1, 'Required'),
  })
  .refine((v) => v.actionType === 'SEND_SMS_TO_CONTACT' || v.actionType === 'SEND_WHATSAPP_TO_CONTACT' || Boolean(v.heading), {
    message: 'Required',
    path: ['heading'],
  })
  .refine((v) => !v.conditionField || Boolean(v.conditionValue), {
    message: 'Enter the value to match',
    path: ['conditionValue'],
  });
export type CreateAutomationFormValues = z.infer<typeof createAutomationSchema>;
