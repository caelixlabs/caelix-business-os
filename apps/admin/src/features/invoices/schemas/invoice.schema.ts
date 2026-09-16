import { z } from 'zod';
import { optionalNumber } from '@/lib/zod-helpers';

export const paymentMethodValues = ['CASH', 'UPI', 'BANK_TRANSFER', 'POS', 'STRIPE'] as const;

export const createInvoiceLineSchema = z.object({
  productId: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  quantity: z.coerce.number().min(0.01, 'Enter a quantity'),
  unitPrice: z.coerce.number().min(0, 'Unit price cannot be negative'),
  taxRate: optionalNumber(z.coerce.number().int().min(0).max(100)),
});

export const createInvoiceSchema = z.object({
  contactId: z.string().min(1, 'Contact is required'),
  branchId: z.string().optional(),
  currency: z.string().optional(),
  discountAmount: optionalNumber(z.coerce.number().min(0)),
  dueDate: z.string().optional(),
  notes: z.string().optional(),
  lines: z.array(createInvoiceLineSchema).min(1, 'Add at least one line item'),
});
export type CreateInvoiceFormValues = z.infer<typeof createInvoiceSchema>;

export const recordPaymentSchema = z.object({
  amount: z.coerce.number().min(0.01, 'Enter an amount'),
  paymentMethod: z.enum(paymentMethodValues),
  referenceId: z.string().optional(),
});
export type RecordPaymentFormValues = z.infer<typeof recordPaymentSchema>;
