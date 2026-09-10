import { Inject, Injectable } from '@nestjs/common';
import type { OrganizationRepository } from '../../domain/repositories/organization.repository';
import { CreateOrganizationCommand } from './create-organization.command';
import { Organization } from '../../domain/entities/organization.entity';
import { customUUID } from '../../../../kernel/utility/uuid';
import { ConflictException } from '@/common/framework/exceptions';
import { ORGANIZATION_REPOSITORY } from '../../domain/repositories';

@Injectable()
export class CreateOrganizationHandler {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly repository: OrganizationRepository,
  ) {}

  async execute(command: CreateOrganizationCommand) {
    const { name, slug, description, industry } = command.dto;
    const exists = await this.repository.findBySlug(slug);

    if (exists) {
      throw new ConflictException(`Organization '${slug}' already exists`);
    }
    const now = new Date();
    const organization = Organization.create({
      id: customUUID.generate(),
      name,
      slug,
      industry: industry,
      description,
      createdAt: now,
      updatedAt: now,
    });

    return this.repository.create(organization);
  }
}
