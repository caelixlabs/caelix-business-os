import {
  IsEmail,
  IsHexadecimal,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsHexadecimal()
  @Length(32, 32)
  organizationId!: string;

  @IsOptional()
  @IsString()
  branchId?: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8, { message: 'password must be at least 8 characters' })
  password!: string;

  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;
}
