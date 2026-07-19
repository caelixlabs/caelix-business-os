import { Organization } from "../domain/entities/organization.entity";
import { Organization as PrismaOrganization } from "@caelix-business-os/database";

export class OrganizationMapper {
  static toDomain(model: PrismaOrganization): Organization {
    return new Organization(
      model.id,
      model.name,
      model.slug,
      model.description ?? undefined
    );
  }

  static toPersistence(entity: Organization) {
    return {
      id:entity.id,
      name: entity.name,
      slug: entity.slug,
      description: entity.description,
    };
  }
}