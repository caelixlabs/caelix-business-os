import { Payment } from "../../domain/entities/payment.entity";

export class PaymentResponseDto {
  id!: string;
  organizationId!: string;
  invoiceId!: string;
  amount!: number;
  paymentMethod!: string;
  referenceId?: string;
  paidAt!: Date;

  static fromDomain(payment: Payment): PaymentResponseDto {
    const dto = new PaymentResponseDto();
    dto.id = payment.id;
    dto.organizationId = payment.organizationId;
    dto.invoiceId = payment.invoiceId;
    dto.amount = payment.amount;
    dto.paymentMethod = payment.paymentMethod;
    dto.referenceId = payment.referenceId;
    dto.paidAt = payment.paidAt;
    return dto;
  }

  static fromDomainList(payments: Payment[]): PaymentResponseDto[] {
    return payments.map((payment) => PaymentResponseDto.fromDomain(payment));
  }
}
