import { IsNotEmpty, IsString } from "class-validator";

export class ListDocumentsDto {
  @IsString()
  @IsNotEmpty()
  entityType!: string;

  @IsString()
  @IsNotEmpty()
  entityId!: string;
}
