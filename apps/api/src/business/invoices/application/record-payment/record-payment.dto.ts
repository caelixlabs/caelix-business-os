import { IsEnum, IsNumber, IsOptional, IsString, Min } from "class-validator";

import { PaymentMethod } from "../../domain/enums";

export class RecordPaymentDto {
  @IsNumber()
  @Min(0.01)
  amount!: number;

  @IsEnum(PaymentMethod)
  paymentMethod!: PaymentMethod;

  @IsOptional()
  @IsString()
  referenceId?: string;
}
