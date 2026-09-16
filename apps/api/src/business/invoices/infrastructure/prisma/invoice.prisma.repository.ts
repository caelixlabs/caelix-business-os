import { Injectable } from "@nestjs/common";

import { PrismaService } from "@/common/prisma";

import { Invoice } from "../../domain/entities/invoice.entity";
import { Payment } from "../../domain/entities/payment.entity";
import type { InvoiceFilters, InvoiceRepository } from "../../domain/repositories/invoice.repository";
import { InvoiceMapper } from "../invoice.mapper";
import { PaymentMapper } from "../payment.mapper";

const WITH_LINES = { lines: true } as const;

@Injectable()
export class InvoicePrismaRepository implements InvoiceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(invoice: Invoice): Promise<Invoice> {
    const model = await this.prisma.client.invoice.create({
      data: InvoiceMapper.toPersistenceCreate(invoice),
      include: WITH_LINES,
    });

    return InvoiceMapper.toDomain(model);
  }

  async findById(organizationId: string, id: string): Promise<Invoice | null> {
    const model = await this.prisma.client.invoice.findFirst({
      where: { id, organizationId },
      include: WITH_LINES,
    });

    return model ? InvoiceMapper.toDomain(model) : null;
  }

  async findByOrganization(organizationId: string, filters?: InvoiceFilters): Promise<Invoice[]> {
    const rows = await this.prisma.client.invoice.findMany({
      where: {
        organizationId,
        status: filters?.status,
        contactId: filters?.contactId,
      },
      include: WITH_LINES,
      orderBy: { createdAt: "desc" },
    });

    return rows.map((row) => InvoiceMapper.toDomain(row));
  }

  async update(invoice: Invoice): Promise<Invoice> {
    const model = await this.prisma.client.invoice.update({
      where: { id: invoice.id },
      data: InvoiceMapper.toPersistenceUpdate(invoice),
      include: WITH_LINES,
    });

    return InvoiceMapper.toDomain(model);
  }

  async countByOrganization(organizationId: string): Promise<number> {
    return this.prisma.client.invoice.count({ where: { organizationId } });
  }

  /**
   * `organizationId` isn't used in the query itself — both `invoice` and
   * `payment` were already loaded/built through tenant-scoped lookups by
   * the caller — but it's kept in the signature so every call site reads
   * as tenant-aware, matching the rest of this repository's methods.
   */
  async recordPayment(
    _organizationId: string,
    invoice: Invoice,
    payment: Payment,
  ): Promise<{ invoice: Invoice; payment: Payment }> {
    const [invoiceModel, paymentModel] = await this.prisma.client.$transaction([
      this.prisma.client.invoice.update({
        where: { id: invoice.id },
        data: InvoiceMapper.toPersistenceUpdate(invoice),
        include: WITH_LINES,
      }),
      this.prisma.client.payment.create({
        data: PaymentMapper.toPersistenceCreate(payment),
      }),
    ]);

    return {
      invoice: InvoiceMapper.toDomain(invoiceModel),
      payment: PaymentMapper.toDomain(paymentModel),
    };
  }

  async findPaymentsByInvoice(organizationId: string, invoiceId: string): Promise<Payment[]> {
    const rows = await this.prisma.client.payment.findMany({
      where: { organizationId, invoiceId },
      orderBy: { paidAt: "desc" },
    });

    return rows.map((row) => PaymentMapper.toDomain(row));
  }
}
