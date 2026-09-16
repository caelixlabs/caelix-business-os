import { IsEmail, IsEnum, IsOptional, IsString } from "class-validator";
import { GymMemberStatus } from "@caelix-business-os/database";

export class UpdateGymMemberDto {
  @IsOptional()
  @IsString()
  branchId?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(GymMemberStatus)
  status?: GymMemberStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
