import { z } from 'zod';
import { optionalNumber } from '@/lib/zod-helpers';

export const productTypeValues = ['PRODUCT', 'SERVICE'] as const;

export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  code: z.string().min(1, 'Product code is required'),
  type: z.enum(productTypeValues),
  description: z.string().optional(),
  price: z.coerce.number().min(0, 'Price cannot be negative'),
  currency: z.string().optional(),
  taxRate: optionalNumber(z.coerce.number().min(0).max(100)),
});
export type CreateProductFormValues = z.infer<typeof createProductSchema>;

export const editProductSchema = z.object({
  name: z.string().min(1, 'Product name is required').optional(),
  description: z.string().optional(),
  price: z.coerce.number().min(0, 'Price cannot be negative').optional(),
  currency: z.string().optional(),
  taxRate: optionalNumber(z.coerce.number().min(0).max(100)),
});
export type EditProductFormValues = z.infer<typeof editProductSchema>;
