import { Inject, Injectable } from "@nestjs/common";

import { EntityNotFoundException } from "@/common/framework/exceptions";

import { INVOICE_REPOSITORY, type InvoiceRepository } from "../../domain/repositories";

@Injectable()
export class ListPaymentsHandler {
  constructor(
    @Inject(INVOICE_REPOSITORY)
    private readonly repository: InvoiceRepository,
  ) {}

  async execute(organizationId: string, invoiceId: string) {
    const invoice = await this.repository.findById(organizationId, invoiceId);

    if (!invoice) {
      throw new EntityNotFoundException("Invoice", invoiceId);
    }

    return this.repository.findPaymentsByInvoice(organizationId, invoiceId);
  }
}
