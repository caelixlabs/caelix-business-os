import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateBranchDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;
}