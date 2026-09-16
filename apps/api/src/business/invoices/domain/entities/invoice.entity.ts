import { AggregateRoot } from "@/common/ddd";

import { InvoiceStatus } from "../enums";
import { buildLineItem, type CreateInvoiceLineItemInput, type InvoiceLineItem } from "./invoice-line-item";

export interface CreateInvoiceProps {
  id: string;
  organizationId: string;
  branchId?: string;
  contactId: string;
  invoiceNumber: string;
  currency?: string;
  discountAmount?: number;
  dueDate?: Date;
  notes?: string;
  lines: CreateInvoiceLineItemInput[];
}

export class Invoice extends AggregateRoot<string> {
  private _status: InvoiceStatus;
  private _subtotal: number;
  private _discountAmount: number;
  private _taxAmount: number;
  private _totalAmount: number;
  private _amountPaid: number;
  private _issuedAt?: Date;
  private _notes?: string;
  private _lines: InvoiceLineItem[];

  constructor(
    id: string,
    public readonly organizationId: string,
    public readonly branchId: string | undefined,
    public readonly contactId: string,
    public readonly invoiceNumber: string,
    public readonly currency: string,
    status: InvoiceStatus,
    subtotal: number,
    discountAmount: number,
    taxAmount: number,
    totalAmount: number,
    amountPaid: number,
    public readonly dueDate: Date | undefined,
    issuedAt: Date | undefined,
    notes: string | undefined,
    lines: InvoiceLineItem[],
  ) {
    super(id);
    this._status = status;
    this._subtotal = subtotal;
    this._discountAmount = discountAmount;
    this._taxAmount = taxAmount;
    this._totalAmount = totalAmount;
    this._amountPaid = amountPaid;
    this._issuedAt = issuedAt;
    this._notes = notes;
    this._lines = lines;
  }

  static create(props: CreateInvoiceProps): Invoice {
    if (!props.lines || props.lines.length === 0) {
      throw new Error("An invoice must have at least one line item.");
    }

    const discountAmount = props.discountAmount ?? 0;

    if (discountAmount < 0) {
      throw new Error("Discount amount cannot be negative.");
    }

    const lines = props.lines.map((line) => buildLineItem(line));

    const subtotal = round(lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0));
    const taxAmount = round(lines.reduce((sum, line) => sum + (line.lineTotal - line.quantity * line.unitPrice), 0));
    const totalAmount = round(subtotal - discountAmount + taxAmount);

    if (totalAmount < 0) {
      throw new Error("Discount cannot exceed the invoice subtotal and tax.");
    }

    return new Invoice(
      props.id,
      props.organizationId,
      props.branchId,
      props.contactId,
      props.invoiceNumber,
      props.currency ?? "INR",
      InvoiceStatus.DRAFT,
      subtotal,
      discountAmount,
      taxAmount,
      totalAmount,
      0,
      props.dueDate,
      undefined,
      props.notes,
      lines,
    );
  }

  issue(): void {
    if (this._status !== InvoiceStatus.DRAFT) {
      throw new Error(`Only DRAFT invoices can be issued. Current status: ${this._status}`);
    }

    this._status = InvoiceStatus.ISSUED;
    this._issuedAt = new Date();
  }

  void(): void {
    if (this._status === InvoiceStatus.PAID) {
      throw new Error("A fully paid invoice cannot be voided.");
    }

    if (this._status === InvoiceStatus.VOID) {
      return;
    }

    this._status = InvoiceStatus.VOID;
  }

  markOverdue(): void {
    if (this._status !== InvoiceStatus.ISSUED) {
      throw new Error("Only issued invoices can be marked overdue.");
    }

    this._status = InvoiceStatus.OVERDUE;
  }

  recordPayment(amount: number): void {
    if (this._status !== InvoiceStatus.ISSUED && this._status !== InvoiceStatus.OVERDUE) {
      throw new Error(`Payments can only be recorded against an issued invoice. Current status: ${this._status}`);
    }

    if (amount <= 0) {
      throw new Error("Payment amount must be greater than zero.");
    }

    if (round(this._amountPaid + amount) > this._totalAmount) {
      throw new Error(
        `Payment of ${amount} would exceed the outstanding balance of ${round(this._totalAmount - this._amountPaid)}.`,
      );
    }

    this._amountPaid = round(this._amountPaid + amount);

    if (this._amountPaid === this._totalAmount) {
      this._status = InvoiceStatus.PAID;
    }
  }

  get status(): InvoiceStatus {
    return this._status;
  }

  get subtotal(): number {
    return this._subtotal;
  }

  get discountAmount(): number {
    return this._discountAmount;
  }

  get taxAmount(): number {
    return this._taxAmount;
  }

  get totalAmount(): number {
    return this._totalAmount;
  }

  get amountPaid(): number {
    return this._amountPaid;
  }

  get balanceDue(): number {
    return round(this._totalAmount - this._amountPaid);
  }

  get issuedAt(): Date | undefined {
    return this._issuedAt;
  }

  get notes(): string | undefined {
    return this._notes;
  }

  get lines(): InvoiceLineItem[] {
    return this._lines;
  }
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
