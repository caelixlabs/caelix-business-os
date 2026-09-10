import { Inject, Injectable } from '@nestjs/common';
import type { OrganizationRepository } from '../../domain/repositories/organization.repository';
import { UpdateOrganizationCommand } from './update-organization.command';
import { ORGANIZATION_REPOSITORY } from '../../domain/repositories';
import { EntityNotFoundException } from '@/common/framework/exceptions';

@Injectable()
export class UpdateOrganizationHandler {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly repository: OrganizationRepository,
  ) {}

  async execute(command: UpdateOrganizationCommand) {
    const organization = await this.repository.findById(command.id);

    if (!organization) {
      throw new EntityNotFoundException('Organization', command.id);
    }

    organization.update({
      name: command.dto.name,
      description: command.dto.description,
    });

    return this.repository.update(organization);
  }
}
