import {
  IsDateString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBookingDto {
  @IsOptional()
  @IsString()
  branchId?: string;

  @IsString()
  contactId!: string;

  @IsDateString()
  scheduledAt!: string;

  @IsOptional()
  @IsString()
  notes?: string;
}