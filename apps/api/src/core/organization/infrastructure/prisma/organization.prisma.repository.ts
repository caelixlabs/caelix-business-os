import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/prisma";
import { OrganizationRepository } from "../../domain/repositories/organization.repository";
import { Organization } from "../../domain/entities/organization.entity";
import { OrganizationMapper } from "../organization.mapper";

@Injectable()
export class OrganizationPrismaRepository
  extends OrganizationRepository
{
  constructor(
    private readonly prisma: PrismaService,
  ) {
    super();
  }

  async findBySlug(slug: string): Promise<Organization | null> {
    const model = await this.prisma.client.organization.findUnique({
      where: { slug },
    });

    return model ? OrganizationMapper.toDomain(model) : null;
  }

  async create(entity: Organization): Promise<Organization> {
    const model = await this.prisma.client.organization.create({
      data: OrganizationMapper.toPersistence(entity),
    });

    return OrganizationMapper.toDomain(model);
  }

  async findById(id: string): Promise<Organization | null> {
    const model = await this.prisma.client.organization.findUnique({
      where: { id },
    });
    return model ? OrganizationMapper.toDomain(model): null;
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
    const model = await this.prisma.client.organization.update({
      where: { id : organization.id!,     
      },
      data: OrganizationMapper.toPersistence(organization),
    });
    return OrganizationMapper.toDomain(model);
  }
  
  async delete(id: string): Promise<void> {
    await this.prisma.client.organization.delete({
      where: { id },
    });
  }
}