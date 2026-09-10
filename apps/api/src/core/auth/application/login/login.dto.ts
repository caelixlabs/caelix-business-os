import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  // @IsHexadecimal()
  // @Length(32, 32)
  // organizationId!: string;

  /** Organization slug, e.g. "acme-gym" — human-memorable, unlike a raw UUID. */
  @IsString()
  @IsNotEmpty()
  organizationSlug!: string;

  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}
