import { Inject, Injectable } from '@nestjs/common';
import type { BranchRepository } from '../../domain/repositories/branch.repository';
import { BRANCH_REPOSITORY } from '../../domain/repositories';
import { EntityNotFoundException } from '@/common/framework/exceptions';
import { GetBranchQuery } from './get-branch.query';

@Injectable()
export class GetBranchHandler {
  constructor(
    @Inject(BRANCH_REPOSITORY)
    private readonly repository: BranchRepository,
  ) {}

  async execute(query: GetBranchQuery) {
    const branch = await this.repository.findById(query.id);

    if (!branch || branch.organizationId !== query.organizationId) {
      throw new EntityNotFoundException('Branch', query.id);
    }

    return branch;
  }
}
