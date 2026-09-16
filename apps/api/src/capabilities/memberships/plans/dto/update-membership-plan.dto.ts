import { IsEnum, IsInt, IsNumber, IsOptional, IsPositive, IsString, Min } from "class-validator";
import { MembershipPlanStatus } from "@caelix-business-os/database";

export class UpdateMembershipPlanDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  durationDays?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  sessionsIncluded?: number;

  @IsOptional()
  @IsEnum(MembershipPlanStatus)
  status?: MembershipPlanStatus;
}
