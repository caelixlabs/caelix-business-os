import { IsInt, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class SaleLineDto {
  @IsOptional()
  @IsString()
  productId?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0.01)
  quantity!: number;

  @IsNumber()
  @Min(0)
  unitPrice!: number;

  @IsOptional()
  @IsString()
  staffUserId?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  commissionPct?: number;
}
