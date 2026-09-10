import { Inject, Injectable } from '@nestjs/common';
import type { BranchRepository } from '../../domain/repositories/branch.repository';
import { BRANCH_REPOSITORY } from '../../domain/repositories';
import { Branch, BranchType } from '../../domain';
import { customUUID } from '@/kernel/utility/uuid';
import { ConflictException } from '@/common/framework/exceptions';
import { CreateBranchCommand } from './create-branch.command';

@Injectable()
export class CreateBranchHandler {
  constructor(
    @Inject(BRANCH_REPOSITORY)
    private readonly repository: BranchRepository,
  ) {}

  async execute(command: CreateBranchCommand) {
    const existing = await this.repository.findByCode(
      command.organizationId,
      command.dto.code,
    );

    if (existing) {
      throw new ConflictException(
        `Branch code '${command.dto.code}' already exists for this organization`,
      );
    }

    // NOTE: organizationId existence is enforced by the DB foreign key
    // (Branch.organizationId -> Organization.id) rather than an
    // application-layer check here, to avoid a circular module
    // dependency (OrganizationModule already depends on BranchModule
    // for primary-branch auto-creation).
    const branch = Branch.create({
      id: customUUID.generate(),
      organizationId: command.organizationId,
      name: command.dto.name,
      code: command.dto.code,
      type: BranchType.STANDARD,
      description: command.dto.description,
    });

    return this.repository.create(branch);
  }
}
