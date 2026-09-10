import { Inject, Injectable } from '@nestjs/common';
import type { BranchRepository } from '../../domain/repositories/branch.repository';
import { BRANCH_REPOSITORY } from '../../domain/repositories';
import { EntityNotFoundException } from '@/common/framework/exceptions';
import { UpdateBranchCommand } from './update-branch.command';

@Injectable()
export class UpdateBranchHandler {
  constructor(
    @Inject(BRANCH_REPOSITORY)
    private readonly repository: BranchRepository,
  ) { }

  async execute(command: UpdateBranchCommand) {
    const branch = await this.repository.findById(command.id);

    if (!branch || branch.organizationId !== command.organizationId) {
      throw new EntityNotFoundException('Branch', command.id);
    }

    branch.updateDetails({
      name: command.dto.name,
      description: command.dto.description,
    });

    return this.repository.update(branch);
  }
}
