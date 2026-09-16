import type { Payment as PrismaPayment } from "@caelix-business-os/database";
import { PaymentMethod as PrismaPaymentMethod } from "@caelix-business-os/database";

import { Payment } from "../domain/entities/payment.entity";
import { PaymentMethod } from "../domain/enums";

export class PaymentMapper {
  static toDomain(model: PrismaPayment): Payment {
    return Payment.create({
      id: model.id,
      organizationId: model.organizationId,
      invoiceId: model.invoiceId,
      amount: Number(model.amount),
      paymentMethod: model.paymentMethod as PaymentMethod,
      referenceId: model.referenceId ?? undefined,
      paidAt: model.paidAt,
    });
  }

  static toPersistenceCreate(payment: Payment) {
    return {
      id: payment.id,
      organizationId: payment.organizationId,
      invoiceId: payment.invoiceId,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod as PrismaPaymentMethod,
      referenceId: payment.referenceId,
      paidAt: payment.paidAt,
    };
  }
}
