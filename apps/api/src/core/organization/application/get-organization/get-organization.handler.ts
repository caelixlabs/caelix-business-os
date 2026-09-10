import { Inject, Injectable } from '@nestjs/common';
import type { OrganizationRepository } from '../../domain/repositories/organization.repository';
import { GetOrganizationQuery } from './get-organization.query';
import { EntityNotFoundException } from '@/common/framework/exceptions';
import { ORGANIZATION_REPOSITORY } from '../../domain/repositories';

@Injectable()
export class GetOrganizationHandler {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly repository: OrganizationRepository,
  ) {}

  async execute(query: GetOrganizationQuery) {
    const organization = await this.repository.findById(query.id);

    if (!organization) {
      throw new EntityNotFoundException('Organization', query.id);
    }

    return organization;
  }
}
