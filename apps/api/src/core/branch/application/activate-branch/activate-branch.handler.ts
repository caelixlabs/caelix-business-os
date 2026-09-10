import { Inject, Injectable } from '@nestjs/common';
import type { BranchRepository } from '../../domain/repositories/branch.repository';
import { BRANCH_REPOSITORY } from '../../domain/repositories';
import { EntityNotFoundException } from '@/common/framework/exceptions';
import { ActivateBranchCommand } from './activate-branch.command';

@Injectable()
export class ActivateBranchHandler {
  constructor(
    @Inject(BRANCH_REPOSITORY)
    private readonly repository: BranchRepository,
  ) {}

  async execute(command: ActivateBranchCommand) {
    const branch = await this.repository.findById(command.id);

    if (!branch || branch.organizationId !== command.organizationId) {
      throw new EntityNotFoundException('Branch', command.id);
    }

    branch.activate();

    return this.repository.update(branch);
  }
}
