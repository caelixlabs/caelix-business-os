import { z } from 'zod';
import { optionalNumber } from '@/lib/zod-helpers';

export const createInventoryItemSchema = z.object({
  branchId: z.string().min(1, 'Branch is required'),
  productId: z.string().min(1, 'Product is required'),
  quantityOnHand: optionalNumber(z.coerce.number().int().min(0)),
  quantityReserved: optionalNumber(z.coerce.number().int().min(0)),
  reorderLevel: optionalNumber(z.coerce.number().int().min(0)),
});
export type CreateInventoryItemFormValues = z.infer<typeof createInventoryItemSchema>;

export const adjustStockSchema = z.object({
  quantityDelta: z.coerce.number().int().refine((value) => value !== 0, 'Enter a non-zero amount'),
});
export type AdjustStockFormValues = z.infer<typeof adjustStockSchema>;
