import { Inject, Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "@/common/prisma";
import { customUUID } from "@/kernel/utility/uuid";

import { Invoice } from "../../domain/entities/invoice.entity";
import { INVOICE_REPOSITORY, type InvoiceRepository } from "../../domain/repositories";

import { CreateInvoiceDto } from "./create-invoice.dto";

@Injectable()
export class CreateInvoiceHandler {
  constructor(
    @Inject(INVOICE_REPOSITORY)
    private readonly repository: InvoiceRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(organizationId: string, dto: CreateInvoiceDto): Promise<Invoice> {
    const contact = await this.prisma.client.contact.findFirst({
      where: { id: dto.contactId, organizationId },
    });

    if (!contact) {
      throw new NotFoundException("Contact not found.");
    }

    const invoiceCount = await this.repository.countByOrganization(organizationId);
    const invoiceNumber = `INV-${String(invoiceCount + 1).padStart(6, "0")}`;

    const invoice = Invoice.create({
      id: customUUID.generate(),
      organizationId,
      branchId: dto.branchId,
      contactId: dto.contactId,
      invoiceNumber,
      currency: dto.currency,
      discountAmount: dto.discountAmount,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      notes: dto.notes,
      lines: dto.lines.map((line) => ({
        id: customUUID.generate(),
        productId: line.productId,
        description: line.description,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
        taxRate: line.taxRate,
      })),
    });

    return this.repository.create(invoice);
  }
}
