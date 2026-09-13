import { IsInt } from "class-validator";

export class AdjustStockDto {
  @IsInt()
  quantityDelta!: number;
}
