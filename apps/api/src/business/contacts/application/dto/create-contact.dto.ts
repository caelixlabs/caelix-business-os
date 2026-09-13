import { IsEmail, IsEnum, IsOptional, IsString } from "class-validator";
import { ContactType } from "../../domain/enums";

export class CreateContactDto {
  @IsOptional()
  @IsString()
  branchId?: string;

  @IsEnum(ContactType)
  type!: ContactType;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
