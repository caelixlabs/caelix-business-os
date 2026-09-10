import { Inject, Injectable } from '@nestjs/common';
import type { BranchRepository } from '../../domain/repositories/branch.repository';
import { BRANCH_REPOSITORY } from '../../domain/repositories';
import {
  EntityNotFoundException,
  BusinessRuleException,
} from '@/common/framework/exceptions';
import { BranchType } from '../../domain';
import { DeleteBranchCommand } from './delete-branch.command';

@Injectable()
export class DeleteBranchHandler {
  constructor(
    @Inject(BRANCH_REPOSITORY)
    private readonly repository: BranchRepository,
  ) {}

  async execute(command: DeleteBranchCommand) {
    const branch = await this.repository.findById(command.id);

    if (!branch || branch.organizationId !== command.organizationId) {
      throw new EntityNotFoundException('Branch', command.id);
    }

    if (branch.type === BranchType.PRIMARY) {
      throw new BusinessRuleException('The PRIMARY branch cannot be deleted.');
    }

    await this.repository.delete(command.id);
  }
}
