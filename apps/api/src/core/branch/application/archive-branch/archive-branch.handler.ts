import { Inject, Injectable } from '@nestjs/common';
import type { BranchRepository } from '../../domain/repositories/branch.repository';
import { BRANCH_REPOSITORY } from '../../domain/repositories';
import {
  EntityNotFoundException,
  BusinessRuleException,
} from '@/common/framework/exceptions';
import { BranchType } from '../../domain';
import { ArchiveBranchCommand } from './archive-branch.command';

@Injectable()
export class ArchiveBranchHandler {
  constructor(
    @Inject(BRANCH_REPOSITORY)
    private readonly repository: BranchRepository,
  ) {}

  async execute(command: ArchiveBranchCommand) {
    const branch = await this.repository.findById(command.id);

    if (!branch || branch.organizationId !== command.organizationId) {
      throw new EntityNotFoundException('Branch', command.id);
    }

    if (branch.type === BranchType.PRIMARY) {
      throw new BusinessRuleException('The PRIMARY branch cannot be archived.');
    }

    branch.archive();

    return this.repository.update(branch);
  }
}
