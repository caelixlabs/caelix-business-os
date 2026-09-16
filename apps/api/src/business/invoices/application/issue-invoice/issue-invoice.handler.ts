import { Inject, Injectable } from "@nestjs/common";

import { EntityNotFoundException } from "@/common/framework/exceptions";

import { INVOICE_REPOSITORY, type InvoiceRepository } from "../../domain/repositories";

@Injectable()
export class IssueInvoiceHandler {
  constructor(
    @Inject(INVOICE_REPOSITORY)
    private readonly repository: InvoiceRepository,
  ) {}

  async execute(organizationId: string, id: string) {
    const invoice = await this.repository.findById(organizationId, id);

    if (!invoice) {
      throw new EntityNotFoundException("Invoice", id);
    }

    invoice.issue();

    return this.repository.update(invoice);
  }
}
