import { Inject, Injectable } from '@nestjs/common';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { USER_REPOSITORY } from '../../domain/repositories';
import { EntityNotFoundException } from '@/common/framework/exceptions';
import { GetUserQuery } from './get-user.query';

@Injectable()
export class GetUserHandler {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly repository: UserRepository,
  ) {}

  async execute(query: GetUserQuery) {
    const user = await this.repository.findById(query.id);

    if (!user || user.organizationId !== query.organizationId) {
      throw new EntityNotFoundException('User', query.id);
    }

    return user;
  }
}
