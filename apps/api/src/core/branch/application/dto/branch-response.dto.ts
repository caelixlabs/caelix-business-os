import { Branch } from "../../domain";

/**
 * Plain object returned by every Branch controller endpoint.
 * Never return the domain entity directly — its private backing fields
 * (_name, _code, _status) would appear in the JSON with underscore
 * prefixes instead of the clean public names.
 */
export class BranchResponseDto {
  id!: string;
  organizationId!: string;
  name!: string;
  code!: string;
  type!: string;
  status!: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;

  static fromDomain(branch: Branch): BranchResponseDto {
    const dto = new BranchResponseDto();
    dto.id = branch.id;
    dto.organizationId = branch.organizationId;
    dto.name = branch.name;
    dto.code = branch.code;
    dto.type = branch.type;
    dto.status = branch.status;
    dto.description = branch.description;
    return dto;
  }
}