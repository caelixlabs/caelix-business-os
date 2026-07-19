import { Injectable, NotFoundException } from '@nestjs/common';
import { OrganizationRepository } from "../../domain/repositories/organization.repository";
import { Organization } from "../../domain/entities/organization.entity";
import { UpdateOrganizationCommand } from './update-organization.command';

@Injectable()
export class UpdateOrganizationHandler {
  constructor(
    private readonly repository: OrganizationRepository,
  ) {}

  async execute(command: UpdateOrganizationCommand) {
    const existing = await this.repository.findById(command.id);

    if (!existing) {
      throw new NotFoundException('Organization not found');
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