import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";

import { CurrentUser } from "@/core/auth/application/decorators";
import type { AccessTokenPayload } from "@/core/auth/application/services/token.service";
import { RequirePermissions } from "@/core/rbac/application/decorators";
import { PermissionCode } from "@/core/rbac/domain/enums";
import { assertSameOrganization } from "@/core/audit/guards/assert-same-organization";

import { CreateInvoiceHandler } from "../../application/create-invoice/create-invoice.handler";
import { CreateInvoiceDto } from "../../application/create-invoice/create-invoice.dto";
import { GetInvoiceHandler } from "../../application/get-invoice/get-invoice.handler";
import { ListInvoicesHandler } from "../../application/list-invoices/list-invoices.handler";
import { IssueInvoiceHandler } from "../../application/issue-invoice/issue-invoice.handler";
import { VoidInvoiceHandler } from "../../application/void-invoice/void-invoice.handler";
import { RecordPaymentHandler } from "../../application/record-payment/record-payment.handler";
import { RecordPaymentDto } from "../../application/record-payment/record-payment.dto";
import { ListPaymentsHandler } from "../../application/list-payments/list-payments.handler";
import { InvoiceResponseDto } from "../../application/dto/invoice-response.dto";
import { PaymentResponseDto } from "../../application/dto/payment-response.dto";
import type { InvoiceStatus } from "../../domain/enums";

@Controller("organizations/:organizationId/invoices")
export class InvoiceController {
  constructor(
    private readonly createInvoiceHandler: CreateInvoiceHandler,
    private readonly getInvoiceHandler: GetInvoiceHandler,
    private readonly listInvoicesHandler: ListInvoicesHandler,
    private readonly issueInvoiceHandler: IssueInvoiceHandler,
    private readonly voidInvoiceHandler: VoidInvoiceHandler,
    private readonly recordPaymentHandler: RecordPaymentHandler,
    private readonly listPaymentsHandler: ListPaymentsHandler,
  ) {}

  @Post()
  @RequirePermissions(PermissionCode.INVOICE_CREATE)
  async create(
    @Param("organizationId") organizationId: string,
    @Body() dto: CreateInvoiceDto,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    const invoice = await this.createInvoiceHandler.execute(organizationId, dto);
    return InvoiceResponseDto.fromDomain(invoice);
  }

  @Get()
  @RequirePermissions(PermissionCode.INVOICE_READ)
  async list(
    @Param("organizationId") organizationId: string,
    @Query("status") status: InvoiceStatus | undefined,
    @Query("contactId") contactId: string | undefined,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    const invoices = await this.listInvoicesHandler.execute({ organizationId, status, contactId });
    return InvoiceResponseDto.fromDomainList(invoices);
  }

  @Get(":id")
  @RequirePermissions(PermissionCode.INVOICE_READ)
  async get(
    @Param("organizationId") organizationId: string,
    @Param("id") id: string,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    const invoice = await this.getInvoiceHandler.execute({ organizationId, id });
    return InvoiceResponseDto.fromDomain(invoice);
  }

  @Patch(":id/issue")
  @RequirePermissions(PermissionCode.INVOICE_MANAGE)
  async issue(
    @Param("organizationId") organizationId: string,
    @Param("id") id: string,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    const invoice = await this.issueInvoiceHandler.execute(organizationId, id);
    return InvoiceResponseDto.fromDomain(invoice);
  }

  @Patch(":id/void")
  @RequirePermissions(PermissionCode.INVOICE_MANAGE)
  async void_(
    @Param("organizationId") organizationId: string,
    @Param("id") id: string,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    const invoice = await this.voidInvoiceHandler.execute(organizationId, id);
    return InvoiceResponseDto.fromDomain(invoice);
  }

  @Post(":id/payments")
  @RequirePermissions(PermissionCode.PAYMENT_RECORD)
  async recordPayment(
    @Param("organizationId") organizationId: string,
    @Param("id") id: string,
    @Body() dto: RecordPaymentDto,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    const result = await this.recordPaymentHandler.execute(organizationId, id, dto);
    return {
      invoice: InvoiceResponseDto.fromDomain(result.invoice),
      payment: PaymentResponseDto.fromDomain(result.payment),
    };
  }

  @Get(":id/payments")
  @RequirePermissions(PermissionCode.PAYMENT_READ)
  async listPayments(
    @Param("organizationId") organizationId: string,
    @Param("id") id: string,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    assertSameOrganization(currentUser.organizationId, organizationId);
    const payments = await this.listPaymentsHandler.execute(organizationId, id);
    return PaymentResponseDto.fromDomainList(payments);
  }
}
