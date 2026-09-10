import { Inject, Injectable } from '@nestjs/common';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { USER_REPOSITORY } from '../../domain/repositories';
import { ListUsersQuery } from './list-users.query';

@Injectable()
export class ListUsersHandler {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly repository: UserRepository,
  ) {}

  execute(query: ListUsersQuery) {
    return this.repository.findByOrganization(query.organizationId);
  }
}
