import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from "class-validator";

export class CreateMembershipPlanDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @IsPositive()
  price!: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsInt()
  @Min(1)
  durationDays!: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  sessionsIncluded?: number;
}
