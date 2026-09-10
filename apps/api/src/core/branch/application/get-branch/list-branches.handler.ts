import { Inject, Injectable } from '@nestjs/common';
import type { BranchRepository } from '../../domain/repositories/branch.repository';
import { BRANCH_REPOSITORY } from '../../domain/repositories';
import { ListBranchesQuery } from './list-branches.query';

@Injectable()
export class ListBranchesHandler {
  constructor(
    @Inject(BRANCH_REPOSITORY)
    private readonly repository: BranchRepository,
  ) { }

  execute(query: ListBranchesQuery) {
    return this.repository.findByOrganization(query.organizationId);
  }
}
