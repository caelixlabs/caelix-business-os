import { Inject, Injectable } from "@nestjs/common";

import { INVOICE_REPOSITORY, type InvoiceRepository } from "../../domain/repositories";

import { ListInvoicesQuery } from "./list-invoices.query";

@Injectable()
export class ListInvoicesHandler {
  constructor(
    @Inject(INVOICE_REPOSITORY)
    private readonly repository: InvoiceRepository,
  ) {}

  execute(query: ListInvoicesQuery) {
    return this.repository.findByOrganization(query.organizationId, {
      status: query.status,
      contactId: query.contactId,
    });
  }
}
