import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/common/prisma';
import { PrismaRepository } from '@/common/prisma/prisma.repository';
import { EventBus } from '@/common/ddd';

import { User, UserRepository } from '../../domain';
import { UserMapper } from '../user.mapper';

@Injectable()
export class UserPrismaRepository
  extends PrismaRepository
  implements UserRepository
{
  constructor(prisma: PrismaService, eventBus: EventBus) {
    super(prisma, eventBus);
  }

  async create(entity: User): Promise<User> {
    const model = await this.runInTransaction(entity, 'User', (tx) =>
      tx.user.create({
        data: UserMapper.toPersistence(entity),
      }),
    );

    return UserMapper.toDomain(model);
  }

  async findById(id: string): Promise<User | null> {
    const model = await this.prisma.client.user.findUnique({ where: { id } });
    return model ? UserMapper.toDomain(model) : null;
  }

  async findByEmail(
    organizationId: string,
    email: string,
  ): Promise<User | null> {
    const model = await this.prisma.client.user.findFirst({
      where: { organizationId, email: email.trim().toLowerCase() },
    });
    return model ? UserMapper.toDomain(model) : null;
  }

  async findByOrganization(organizationId: string): Promise<User[]> {
    const rows = await this.prisma.client.user.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map(UserMapper.toDomain);
  }

  async findAll(): Promise<User[]> {
    const rows = await this.prisma.client.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return rows.map(UserMapper.toDomain);
  }

  async update(entity: User): Promise<User> {
    const model = await this.runInTransaction(entity, 'User', (tx) =>
      tx.user.update({
        where: { id: entity.id },
        data: UserMapper.toPersistence(entity),
      }),
    );
    return UserMapper.toDomain(model);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.client.user.delete({ where: { id } });
  }
}
