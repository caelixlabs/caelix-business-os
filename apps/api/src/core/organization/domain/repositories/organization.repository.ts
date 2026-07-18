import { Organization } from '../entities/organization.entity';

export abstract class OrganizationRepository {
  abstract create(
    organization: Organization,
  ): Promise<Organization>;

  abstract findBySlug(
    slug: string,
  ): Promise<Organization | null>;
}