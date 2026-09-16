import { Invoice } from "../entities/invoice.entity";
import { Payment } from "../entities/payment.entity";
import { InvoiceStatus } from "../enums";

export interface InvoiceFilters {
  status?: InvoiceStatus;
  contactId?: string;
}

export interface InvoiceRepository {
  create(invoice: Invoice): Promise<Invoice>;

  findById(organizationId: string, id: string): Promise<Invoice | null>;

  findByOrganization(organizationId: string, filters?: InvoiceFilters): Promise<Invoice[]>;

  update(invoice: Invoice): Promise<Invoice>;

  countByOrganization(organizationId: string): Promise<number>;

  recordPayment(
    organizationId: string,
    invoice: Invoice,
    payment: Payment,
  ): Promise<{ invoice: Invoice; payment: Payment }>;

  findPaymentsByInvoice(organizationId: string, invoiceId: string): Promise<Payment[]>;
}
