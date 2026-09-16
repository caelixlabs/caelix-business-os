import { ArrayNotEmpty, IsArray, IsDateString, IsEnum, IsInt, IsOptional, IsString, Min } from "class-validator";
import { GymClassStatus } from "@caelix-business-os/database";

export class UpdateGymClassDto {
  @IsOptional()
  @IsString()
  trainerUserId?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  days?: string[];

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsOptional()
  @IsEnum(GymClassStatus)
  status?: GymClassStatus;
}
