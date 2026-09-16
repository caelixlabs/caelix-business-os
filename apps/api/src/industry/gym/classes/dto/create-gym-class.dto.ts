import { ArrayNotEmpty, IsArray, IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";

export class CreateGymClassDto {
  @IsString()
  @IsNotEmpty()
  branchId!: string;

  @IsOptional()
  @IsString()
  trainerUserId?: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;

  @IsDateString()
  startDate!: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  days!: string[];

  @IsString()
  @IsNotEmpty()
  startTime!: string;

  @IsString()
  @IsNotEmpty()
  endTime!: string;
}
