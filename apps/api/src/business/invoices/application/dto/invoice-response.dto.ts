import { Invoice } from "../../domain/entities/invoice.entity";
import type { InvoiceLineItem } from "../../domain/entities/invoice-line-item";

export class InvoiceResponseDto {
  id!: string;
  organizationId!: string;
  branchId?: string;
  contactId!: string;
  invoiceNumber!: string;
  status!: string;
  currency!: string;
  subtotal!: number;
  discountAmount!: number;
  taxAmount!: number;
  totalAmount!: number;
  amountPaid!: number;
  balanceDue!: number;
  dueDate?: Date;
  issuedAt?: Date;
  notes?: string;
  lines!: InvoiceLineItem[];

  static fromDomain(invoice: Invoice): InvoiceResponseDto {
    const dto = new InvoiceResponseDto();
    dto.id = invoice.id;
    dto.organizationId = invoice.organizationId;
    dto.branchId = invoice.branchId;
    dto.contactId = invoice.contactId;
    dto.invoiceNumber = invoice.invoiceNumber;
    dto.status = invoice.status;
    dto.currency = invoice.currency;
    dto.subtotal = invoice.subtotal;
    dto.discountAmount = invoice.discountAmount;
    dto.taxAmount = invoice.taxAmount;
    dto.totalAmount = invoice.totalAmount;
    dto.amountPaid = invoice.amountPaid;
    dto.balanceDue = invoice.balanceDue;
    dto.dueDate = invoice.dueDate;
    dto.issuedAt = invoice.issuedAt;
    dto.notes = invoice.notes;
    dto.lines = invoice.lines;
    return dto;
  }

  static fromDomainList(invoices: Invoice[]): InvoiceResponseDto[] {
    return invoices.map((invoice) => InvoiceResponseDto.fromDomain(invoice));
  }
}
