import type { Invoice as PrismaInvoice, InvoiceLine as PrismaInvoiceLine } from "@caelix-business-os/database";
import { InvoiceStatus as PrismaInvoiceStatus } from "@caelix-business-os/database";

import { Invoice } from "../domain/entities/invoice.entity";
import type { InvoiceLineItem } from "../domain/entities/invoice-line-item";
import { InvoiceStatus } from "../domain/enums";

type InvoiceWithLines = PrismaInvoice & { lines: PrismaInvoiceLine[] };

export class InvoiceMapper {
  static toDomain(model: InvoiceWithLines): Invoice {
    const lines: InvoiceLineItem[] = model.lines
      .map((line) => ({
        id: line.id,
        productId: line.productId ?? undefined,
        description: line.description,
        quantity: Number(line.quantity),
        unitPrice: Number(line.unitPrice),
        taxRate: line.taxRate !== null ? Number(line.taxRate) : undefined,
        lineTotal: Number(line.lineTotal),
      }))
      .sort((a, b) => a.id.localeCompare(b.id));

    return new Invoice(
      model.id,
      model.organizationId,
      model.branchId ?? undefined,
      model.contactId,
      model.invoiceNumber,
      model.currency,
      model.status as InvoiceStatus,
      Number(model.subtotal),
      Number(model.discountAmount),
      Number(model.taxAmount),
      Number(model.totalAmount),
      Number(model.amountPaid),
      model.dueDate ?? undefined,
      model.issuedAt ?? undefined,
      model.notes ?? undefined,
      lines,
    );
  }

  static toPersistenceCreate(invoice: Invoice) {
    return {
      id: invoice.id,
      organizationId: invoice.organizationId,
      branchId: invoice.branchId,
      contactId: invoice.contactId,
      invoiceNumber: invoice.invoiceNumber,
      currency: invoice.currency,
      status: invoice.status as PrismaInvoiceStatus,
      subtotal: invoice.subtotal,
      discountAmount: invoice.discountAmount,
      taxAmount: invoice.taxAmount,
      totalAmount: invoice.totalAmount,
      amountPaid: invoice.amountPaid,
      dueDate: invoice.dueDate,
      issuedAt: invoice.issuedAt,
      notes: invoice.notes,
      lines: {
        create: invoice.lines.map((line) => ({
          id: line.id,
          productId: line.productId,
          description: line.description,
          quantity: line.quantity,
          unitPrice: line.unitPrice,
          taxRate: line.taxRate,
          lineTotal: line.lineTotal,
        })),
      },
    };
  }

  static toPersistenceUpdate(invoice: Invoice) {
    return {
      status: invoice.status as PrismaInvoiceStatus,
      amountPaid: invoice.amountPaid,
      issuedAt: invoice.issuedAt,
    };
  }
}
