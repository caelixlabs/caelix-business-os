import { Inject, Injectable } from '@nestjs/common';
import { RBAC_REPOSITORY } from '../../domain/repositories';
import type { RbacRepository } from '../../domain/repositories';
import { ListRolesQuery } from './list-roles.query';

@Injectable()
export class ListRolesHandler {
  constructor(
    @Inject(RBAC_REPOSITORY) private readonly rbacRepository: RbacRepository,
  ) {}

  execute(query: ListRolesQuery) {
    return this.rbacRepository.listRolesForOrganization(query.organizationId);
  }
}
