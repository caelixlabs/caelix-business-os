import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IndustryType } from '../../domain/enums/industry-type.enum';

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  slug!: string;

  @IsOptional()
  @IsString()
  description?: string;
  
  @IsEnum(IndustryType)
  @IsNotEmpty()
  industry!: IndustryType;
}
