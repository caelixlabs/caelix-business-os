import { Organization } from '../entities/organization.entity';
import { Repository } from '@/common/ddd';

export interface OrganizationRepository extends Repository<Organization> {
  create(organization: Organization): Promise<Organization>;

  findBySlug(slug: string): Promise<Organization | null>;

  //GET Organization
  findById(id: string): Promise<Organization | null>;

  //list Organizations
  findAll(): Promise<Organization[]>;

  //update organization
  update(entity: Organization): Promise<Organization>;

  //delete organization
  delete(id: string): Promise<void>;
}
