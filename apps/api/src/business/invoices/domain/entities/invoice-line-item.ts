export interface InvoiceLineItem {
  id: string;
  productId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate?: number;
  lineTotal: number;
}

export interface CreateInvoiceLineItemInput {
  id: string;
  productId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate?: number;
}

export function buildLineItem(input: CreateInvoiceLineItemInput): InvoiceLineItem {
  if (input.quantity <= 0) {
    throw new Error('Line quantity must be greater than zero.');
  }

  if (input.unitPrice < 0) {
    throw new Error('Line unit price cannot be negative.');
  }

  const base = input.quantity * input.unitPrice;
  const tax = input.taxRate ? base * (input.taxRate / 100) : 0;

  return {
    id: input.id,
    productId: input.productId,
    description: input.description.trim(),
    quantity: input.quantity,
    unitPrice: input.unitPrice,
    taxRate: input.taxRate,
    lineTotal: Math.round((base + tax) * 100) / 100,
  };
}
