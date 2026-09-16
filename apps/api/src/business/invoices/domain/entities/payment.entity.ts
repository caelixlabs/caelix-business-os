import { PaymentMethod } from "../enums";

export interface CreatePaymentProps {
  id: string;
  organizationId: string;
  invoiceId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  referenceId?: string;
  paidAt?: Date;
}

export class Payment {
  private constructor(
    private readonly props: {
      id: string;
      organizationId: string;
      invoiceId: string;
      amount: number;
      paymentMethod: PaymentMethod;
      referenceId?: string;
      paidAt: Date;
    },
  ) {}

  static create(props: CreatePaymentProps): Payment {
    if (props.amount <= 0) {
      throw new Error("Payment amount must be greater than zero.");
    }

    return new Payment({
      ...props,
      paidAt: props.paidAt ?? new Date(),
    });
  }

  get id(): string {
    return this.props.id;
  }

  get organizationId(): string {
    return this.props.organizationId;
  }

  get invoiceId(): string {
    return this.props.invoiceId;
  }

  get amount(): number {
    return this.props.amount;
  }

  get paymentMethod(): PaymentMethod {
    return this.props.paymentMethod;
  }

  get referenceId(): string | undefined {
    return this.props.referenceId;
  }

  get paidAt(): Date {
    return this.props.paidAt;
  }
}
