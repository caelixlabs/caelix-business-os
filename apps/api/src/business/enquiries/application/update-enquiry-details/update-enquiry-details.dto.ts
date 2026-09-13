import { IsOptional, IsString } from "class-validator";

export class UpdateEnquiryDetailsDto {
  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
