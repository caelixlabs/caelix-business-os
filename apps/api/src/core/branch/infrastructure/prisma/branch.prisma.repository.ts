import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/common/prisma';
import { PrismaRepository } from '@/common/prisma/prisma.repository';
import { EventBus } from '@/common/ddd';

import { Branch, BranchRepository } from '../../domain/index';

import { BranchMapper } from '../branch.mapper';

@Injectable()
export class BranchPrismaRepository
  extends PrismaRepository
  implements BranchRepository
{
  constructor(prisma: PrismaService, eventBus: EventBus) {
    super(prisma, eventBus);
  }

  async create(entity: Branch): Promise<Branch> {
    const model = await this.runInTransaction(entity, 'Branch', (tx) =>
      tx.branch.create({
        data: BranchMapper.toPersistence(entity),
      }),
    );

    return BranchMapper.toDomain(model);
  }

  async findById(id: string): Promise<Branch | null> {
    const model = await this.prisma.client.branch.findUnique({
      where: { id },
    });
    return model ? BranchMapper.toDomain(model) : null;
  }

  async findByCode(
    organizationId: string,
    code: string,
  ): Promise<Branch | null> {
    const model = await this.prisma.client.branch.findFirst({
      where: {
        organizationId,
        code,
      },
    });

    return model ? BranchMapper.toDomain(model) : null;
  }

  async findAll(): Promise<Branch[]> {
    const rows = await this.prisma.client.branch.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return rows.map(BranchMapper.toDomain);
  }

  async update(entity: Branch): Promise<Branch> {
    const model = await this.runInTransaction(entity, 'Branch', (tx) =>
      tx.branch.update({
        where: {
          id: entity.id,
        },
        data: BranchMapper.toPersistence(entity),
      }),
    );
    return BranchMapper.toDomain(model);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.client.branch.delete({
      where: { id },
    });
  }

  async existsPrimaryBranch(organizationId: string): Promise<boolean> {
    const branch = await this.prisma.client.branch.findFirst({
      where: {
        organizationId,
        type: 'PRIMARY',
      },
      select: {
        id: true,
      },
    });

    return !!branch;
  }

  async findByOrganization(organizationId: string): Promise<Branch[]> {
    const rows = await this.prisma.client.branch.findMany({
      where: {
        organizationId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return rows.map(BranchMapper.toDomain);
  }
}
