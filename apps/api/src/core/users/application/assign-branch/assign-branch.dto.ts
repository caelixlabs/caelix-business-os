import { IsOptional, IsString } from 'class-validator';

export class AssignBranchDto {
  @IsOptional()
  @IsString()
  branchId?: string;
}