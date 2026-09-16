export type PaymentMethod = 'STRIPE' | 'CASH' | 'BANK_TRANSFER' | 'UPI' | 'POS';
export type SaleStatus = 'COMPLETED' | 'REFUNDED';

export interface SaleLine {
  id: string;
  productId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  staffUserId?: string;
  commissionPct?: number;
  commissionAmount?: number;
  staffUser?: { id: string; firstName: string; lastName: string };
}

export interface Sale {
  id: string;
  status: SaleStatus;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  createdAt: string;
  lines: SaleLine[];
  contact?: { firstName?: string; lastName?: string };
}

export interface CheckoutLineInput {
  productId?: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  staffUserId?: string;
  commissionPct?: number;
}

export interface CheckoutInput {
  branchId?: string;
  contactId?: string;
  soldByUserId?: string;
  paymentMethod: PaymentMethod;
  lines: CheckoutLineInput[];
}
