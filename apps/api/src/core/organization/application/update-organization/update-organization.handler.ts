import { Inject, Injectable } from '@nestjs/common';
import type { OrganizationRepository } from "../../domain/repositories/organization.repository";
import { Organization } from "../../domain/entities/organization.entity";
import { UpdateOrganizationCommand } from './update-organization.command';
import { ORGANIZATION_REPOSITORY } from '../../domain/repositories';
import { ConflictException } from '@/common/framework/exceptions';

@Injectable()
export class UpdateOrganizationHandler {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly repository: OrganizationRepository,
  ) {}

  async execute(command: UpdateOrganizationCommand) {
    const existing = await this.repository.findById(command.id);

    if (!existing) {
      throw new ConflictException('Organization already exists.');
    }

    const organization = new Organization(
      existing.id,
      command.dto.name ?? existing.name,
      existing.slug,
      command.dto.description ?? existing.description,
    );

    return this.repository.update(organization);
  }
}