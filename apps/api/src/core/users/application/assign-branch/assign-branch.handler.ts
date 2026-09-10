import { Inject, Injectable } from '@nestjs/common';
import { EntityNotFoundException } from '@/common/framework/exceptions';
import { BRANCH_REPOSITORY, type BranchRepository} from '@/core/branch';
import { USER_REPOSITORY, type UserRepository} from '../../domain/repositories';
import { AssignBranchCommand } from './assign-branch.command';

@Injectable()
export class AssignBranchHandler {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,

    @Inject(BRANCH_REPOSITORY)
    private readonly branchRepository: BranchRepository,
  ) { }

  async execute(command: AssignBranchCommand) {
    const user = await this.userRepository.findById(command.userId);

    if (!user || user.organizationId !== command.organizationId) {
      throw new EntityNotFoundException('User', command.userId);
    }

    // No branchId means: remove the current branch assignment.
    if (!command.branchId) {
      user.assignBranch(undefined);

      return this.userRepository.update(user);
    }

    const branch = await this.branchRepository.findById(command.branchId);

    if (!branch || branch.organizationId !== command.organizationId) {
      throw new EntityNotFoundException('Branch', command.branchId);
    }

    user.assignBranch(branch.id);

    return this.userRepository.update(user);
  }
}