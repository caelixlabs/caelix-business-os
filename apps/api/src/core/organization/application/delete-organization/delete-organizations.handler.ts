import { Inject, Injectable } from '@nestjs/common';
import type { OrganizationRepository } from '../../domain/repositories/organization.repository';
import { DeleteOrganizationCommand } from './delete-organizations.command';
import { EntityNotFoundException } from '@/common/framework/exceptions';
import { ORGANIZATION_REPOSITORY } from '../../domain/repositories';

@Injectable()
export class DeleteOrganizationHandler {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly repository: OrganizationRepository,
  ) {}

  async execute(command: DeleteOrganizationCommand) {
    const organization = await this.repository.findById(command.id);

    if (!organization) {
      throw new EntityNotFoundException('Organization', command.id);
    }

    await this.repository.delete(command.id);
  }
}
