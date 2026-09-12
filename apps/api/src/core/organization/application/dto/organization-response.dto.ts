import { Organization } from '../../domain/entities/organization.entity';
import { IndustryType } from '../../domain/enums/industry-type.enum';

export class OrganizationResponseDto {
  id!: string;
  name!: string;
  slug!: string;
  description?: string;
  industry!: IndustryType;
  createdAt?: Date;
  updatedAt?: Date;

  static fromDomain(org: Organization): OrganizationResponseDto {
    const dto = new OrganizationResponseDto();
    dto.id = org.id;
    dto.name = org.name;
    dto.slug = org.slug;
    dto.description = org.description;
    dto.industry = org.industry;
    dto.createdAt = org.createdAt;
    dto.updatedAt = org.updatedAt;
    return dto;
  }
}