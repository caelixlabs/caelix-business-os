import {
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateInventoryItemDto {
  @IsString()
  organizationId!: string;

  @IsString()
  branchId!: string;

  @IsString()
  productId!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  quantityOnHand?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  quantityReserved?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  reorderLevel?: number;
}