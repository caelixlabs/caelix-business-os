import { IsDateString, IsOptional, IsString } from "class-validator";

export class UpdateBookingDto {
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
