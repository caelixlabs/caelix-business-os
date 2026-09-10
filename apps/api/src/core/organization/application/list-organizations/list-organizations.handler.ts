import { Inject, Injectable } from '@nestjs/common';
import type { OrganizationRepository } from '../../domain/repositories/organization.repository';
import { ListOrganizationsQuery } from './list-organizations.query';
import { ORGANIZATION_REPOSITORY } from '../../domain/repositories';

@Injectable()
export class ListOrganizationsHandler {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly repository: OrganizationRepository,
  ) {}

  async execute(_: ListOrganizationsQuery) {
    return this.repository.findAll();
  }
}
