import type { InvoiceStatus } from "../../domain/enums";

export interface ListInvoicesQuery {
  organizationId: string;
  status?: InvoiceStatus;
  contactId?: string;
}
