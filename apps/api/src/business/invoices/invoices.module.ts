import { Module } from "@nestjs/common";

import { INVOICE_REPOSITORY } from "./domain/repositories";
import { InvoicePrismaRepository } from "./infrastructure/prisma/invoice.prisma.repository";

import { CreateInvoiceHandler } from "./application/create-invoice/create-invoice.handler";
import { GetInvoiceHandler } from "./application/get-invoice/get-invoice.handler";
import { ListInvoicesHandler } from "./application/list-invoices/list-invoices.handler";
import { IssueInvoiceHandler } from "./application/issue-invoice/issue-invoice.handler";
import { VoidInvoiceHandler } from "./application/void-invoice/void-invoice.handler";
import { RecordPaymentHandler } from "./application/record-payment/record-payment.handler";
import { ListPaymentsHandler } from "./application/list-payments/list-payments.handler";

import { InvoiceController } from "./presentation/controllers/invoice.controller";

@Module({
  controllers: [InvoiceController],

  providers: [
    {
      provide: INVOICE_REPOSITORY,
      useClass: InvoicePrismaRepository,
    },

    CreateInvoiceHandler,
    GetInvoiceHandler,
    ListInvoicesHandler,
    IssueInvoiceHandler,
    VoidInvoiceHandler,
    RecordPaymentHandler,
    ListPaymentsHandler,
  ],

  exports: [
    INVOICE_REPOSITORY,
    CreateInvoiceHandler,
    GetInvoiceHandler,
    ListInvoicesHandler,
    IssueInvoiceHandler,
    VoidInvoiceHandler,
    RecordPaymentHandler,
    ListPaymentsHandler,
  ],
})
export class InvoicesModule {}
