import { Repository } from '@/common/ddd';
import { User } from '../entities/user.entity';

export interface UserRepository extends Repository<User> {
  findByEmail(organizationId: string, email: string): Promise<User | null>;
  findByOrganization(organizationId: string): Promise<User[]>;
}
