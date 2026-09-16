export type InvoiceStatus = 'DRAFT' | 'ISSUED' | 'PAID' | 'OVERDUE' | 'VOID';
export type PaymentMethod = 'STRIPE' | 'CASH' | 'BANK_TRANSFER' | 'UPI' | 'POS';

export interface InvoiceLine {
  id: string;
  productId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate?: number;
  lineTotal: number;
}

export interface Invoice {
  id: string;
  organizationId: string;
  branchId?: string;
  contactId: string;
  invoiceNumber: string;
  status: InvoiceStatus;
  currency: string;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  amountPaid: number;
  balanceDue: number;
  dueDate?: string;
  issuedAt?: string;
  notes?: string;
  lines: InvoiceLine[];
}

export interface Payment {
  id: string;
  organizationId: string;
  invoiceId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  referenceId?: string;
  paidAt: string;
}
