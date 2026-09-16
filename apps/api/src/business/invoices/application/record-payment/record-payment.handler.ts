import { Inject, Injectable } from "@nestjs/common";

import { EntityNotFoundException } from "@/common/framework/exceptions";
import { customUUID } from "@/kernel/utility/uuid";

import { Payment } from "../../domain/entities/payment.entity";
import { INVOICE_REPOSITORY, type InvoiceRepository } from "../../domain/repositories";

import { RecordPaymentDto } from "./record-payment.dto";

@Injectable()
export class RecordPaymentHandler {
  constructor(
    @Inject(INVOICE_REPOSITORY)
    private readonly repository: InvoiceRepository,
  ) {}

  async execute(organizationId: string, invoiceId: string, dto: RecordPaymentDto) {
    const invoice = await this.repository.findById(organizationId, invoiceId);

    if (!invoice) {
      throw new EntityNotFoundException("Invoice", invoiceId);
    }

    invoice.recordPayment(dto.amount);

    const payment = Payment.create({
      id: customUUID.generate(),
      organizationId,
      invoiceId,
      amount: dto.amount,
      paymentMethod: dto.paymentMethod,
      referenceId: dto.referenceId,
    });

    return this.repository.recordPayment(organizationId, invoice, payment);
  }
}
