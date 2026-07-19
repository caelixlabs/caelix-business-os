import { Organization } from '../entities/organization.entity';

export abstract class OrganizationRepository {
  abstract create(
    organization: Organization,
  ): Promise<Organization>;

  abstract findBySlug(
    slug: string,
  ): Promise<Organization | null>;
  
  //GET Organization
  abstract findById(id: string): Promise<Organization | null>;
  
  //list Organizations
  abstract findAll(): Promise<Organization[]>;

  //update organization
  abstract update(entity: Organization): Promise<Organization>;

  //delete organization
  abstract delete(id: string): Promise<void>;
  
}