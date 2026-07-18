import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/prisma";
import { OrganizationRepository } from "../../domain/repositories/organization.repository";
import { Organization } from "@caelix-business-os/database";

@Injectable()
export class OrganizationPrismaRepository
  implements OrganizationRepository
{
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    organization: Organization,
  ): Promise<Organization> {
    throw new Error('Not implemented');
  }

  async findBySlug(
    slug: string,
  ): Promise<Organization | null> {
    throw new Error('Not implemented');
  }
}