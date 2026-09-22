import { IsBoolean, IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min, MinLength } from "class-validator";

export class CreateSignatureRequestDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  body!: string;

  @IsString()
  @IsNotEmpty()
  signerName!: string;

  @IsEmail()
  signerEmail!: string;

  @IsOptional()
  @IsString()
  contactId?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(90)
  expiresInDays?: number;
}

export class SignDto {
  @IsString()
  @MinLength(2)
  typedName!: string;

  @IsBoolean()
  agreed!: boolean;
}

export class DeclineDto {
  @IsOptional()
  @IsString()
  reason?: string;
}
