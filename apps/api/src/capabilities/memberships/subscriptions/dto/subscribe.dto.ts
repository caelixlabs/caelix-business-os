import { IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SubscribeDto {
  @IsString()
  @IsNotEmpty()
  contactId!: string;

  @IsString()
  @IsNotEmpty()
  planId!: string;

  @IsOptional()
  @IsDateString()
  startsAt?: string;

  @IsOptional()
  @IsBoolean()
  autoRenew?: boolean;
}
