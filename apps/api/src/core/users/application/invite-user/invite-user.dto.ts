import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class InviteUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8, { message: 'password must be at least 8 characters' })
  temporaryPassword!: string;

  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsOptional()
  @IsUUID()
  branchId?: string;
}
