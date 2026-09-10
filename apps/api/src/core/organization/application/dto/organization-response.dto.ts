import { Organization } from '../../domain/entities/organization.entity';

export class OrganizationResponseDto {
  id!: string;
  name!: string;
  slug!: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;

  static fromDomain(org: Organization): OrganizationResponseDto {
    const dto = new OrganizationResponseDto();
    dto.id = org.id;
    dto.name = org.name;
    dto.slug = org.slug;
    dto.description = org.description;
    dto.createdAt = org.createdAt;
    dto.updatedAt = org.updatedAt;
    return dto;
  }
}