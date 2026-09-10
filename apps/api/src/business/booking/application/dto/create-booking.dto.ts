import {
  IsDateString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBookingDto {
  @IsString()
  organizationId!: string;

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