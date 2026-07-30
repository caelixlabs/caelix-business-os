import { Branch as PrismaBranch, BranchStatus as PrismaBranchStatus } from "@caelix-business-os/database";

import { Branch } from '../domain/entities/branch.entity';
import { BranchStatus } from '../domain/enums';

export class BranchMapper {
  static toDomain( model: PrismaBranch): Branch {
    return new Branch(
      model.id,
      model.organizationId,
      model.name,
      model.code,
      model.status as BranchStatus,
      model.description ?? undefined,
    );

  }

  static toPersistence(
    branch: Branch,
  ) {
    return {
      id: branch.id,
      organizationId: branch.organizationId,
      name: branch.name,
      code: branch.code,
      description: branch.description,
      status: branch.status as PrismaBranchStatus,
    };
  }
}