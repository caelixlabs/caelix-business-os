import {
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

import {
  EnquirySource,
} from '../../domain/enums';

export class CreateEnquiryDto {
  @IsOptional()
  @IsString()
  branchId?: string;

  @IsString()
  contactId!: string;

  @IsOptional()
  @IsString()
  assignedUserId?: string;

  @IsEnum(EnquirySource)
  source!: EnquirySource;

  @IsString()
  subject!: string;

  @IsOptional()
  @IsString()
  description?: string;
}