import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateMusicEnrollmentDto {
  @IsString()
  @IsNotEmpty()
  studentId!: string;

  @IsString()
  @IsNotEmpty()
  batchId!: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  feeAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discountAmount?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
