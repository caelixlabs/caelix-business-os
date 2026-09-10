import { Injectable } from '@nestjs/common';
import type { OrganizationRepository } from '../../domain/repositories/organization.repository';
import { Organization } from '../../domain/entities/organization.entity';
import { OrganizationMapper } from '../organization.mapper';
import { PrismaService } from '@/common/prisma';
import { PrismaRepository } from '@/common/prisma/prisma.repository';
import { EventBus } from '@/common/ddd';

@Injectable()
export class OrganizationPrismaRepository
  extends PrismaRepository
  implements OrganizationRepository
{
  constructor(prisma: PrismaService, eventBus: EventBus) {
    super(prisma, eventBus);
  }

  async findBySlug(slug: string): Promise<Organization | null> {
    const model = await this.prisma.client.organization.findUnique({
      where: { slug },
    });

    return model ? OrganizationMapper.toDomain(model) : null;
  }

  async create(entity: Organization): Promise<Organization> {
    const model = await this.runInTransaction(entity, 'Organization', (tx) =>
      tx.organization.create({
        data: OrganizationMapper.toPersistence(entity),
      }),
    );

    return OrganizationMapper.toDomain(model);
  }

  async findById(id: string): Promise<Organization | null> {
    const model = await this.prisma.client.organization.findUnique({
      where: { id },
      include: {
        branches: true,
      },
    });
    return model ? OrganizationMapper.toDomain(model) : null;
  }

  async findAll(): Promise<Organization[]> {
    const rows = await this.prisma.client.organization.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return rows.map(OrganizationMapper.toDomain);
  }

  async update(organization: Organization): Promise<Organization> {
    const model = await this.runInTransaction(
      organization,
      'Organization',
      (tx) =>
        tx.organization.update({
          where: {
            id: organization.id,
          },
          data: OrganizationMapper.toPersistence(organization),
        }),
    );
    return OrganizationMapper.toDomain(model);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.client.organization.delete({
      where: { id },
    });
  }
}
