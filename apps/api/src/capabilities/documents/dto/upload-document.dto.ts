import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UploadDocumentDto {
  @IsString()
  @IsNotEmpty()
  entityType!: string;

  @IsString()
  @IsNotEmpty()
  entityId!: string;

  @IsOptional()
  @IsString()
  branchId?: string;
}
