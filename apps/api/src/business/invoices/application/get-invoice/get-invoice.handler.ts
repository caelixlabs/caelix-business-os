import { Inject, Injectable } from "@nestjs/common";

import { EntityNotFoundException } from "@/common/framework/exceptions";

import { INVOICE_REPOSITORY, type InvoiceRepository } from "../../domain/repositories";

import { GetInvoiceQuery } from "./get-invoice.query";

@Injectable()
export class GetInvoiceHandler {
  constructor(
    @Inject(INVOICE_REPOSITORY)
    private readonly repository: InvoiceRepository,
  ) {}

  async execute(query: GetInvoiceQuery) {
    const invoice = await this.repository.findById(query.organizationId, query.id);

    if (!invoice) {
      throw new EntityNotFoundException("Invoice", query.id);
    }

    return invoice;
  }
}
