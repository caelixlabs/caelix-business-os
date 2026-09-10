import { Organization } from '../domain/entities/organization.entity';
import { Organization as PrismaOrganization } from '@caelix-business-os/database';
import { IndustryType } from '../domain/enums/industry-type.enum';

export class OrganizationMapper {
  static toDomain(model: PrismaOrganization): Organization {
    return new Organization(
      model.id,
      model.name,
      model.slug,
      model.industry as IndustryType,
      model.createdAt,
      model.updatedAt,
      model.description ?? undefined,
    );
  }

  static toPersistence(entity: Organization) {
    return {
      id: entity.id,
      name: entity.name,
      slug: entity.slug,
      description: entity.description,
      industry: entity.industry,
    };
  }
}
