import { Inject, Injectable, Logger } from '@nestjs/common';

import { EventHandler, IEventHandler } from '@/common/ddd';

import { OrganizationCreatedEvent } from '../../domain/events';
import { Branch, type BranchRepository } from '@/core/branch/domain';
import { customUUID } from '@/kernel/utility/uuid';
import { BRANCH_REPOSITORY } from '@/core/branch/domain/repositories';

@Injectable()
@EventHandler(OrganizationCreatedEvent)
export class CreateDefaultBranchHandler implements IEventHandler<OrganizationCreatedEvent> {
  private readonly logger = new Logger(CreateDefaultBranchHandler.name);

  constructor(
    @Inject(BRANCH_REPOSITORY)
    private readonly repository: BranchRepository,
  ) {}

  async handle(event: OrganizationCreatedEvent): Promise<void> {
    this.logger.log(
      `Creating default branch for organization ${event.organizationId}`,
    );

    const branch = Branch.createPrimary(
      event.organizationId,
      customUUID.generate(),
    );

    await this.repository.create(branch);

    this.logger.log(
      `Default branch created successfully for organization ${event.organizationId}`,
    );
  }
}
