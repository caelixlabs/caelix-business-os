import { Repository } from '@/common/ddd';

import { Branch } from '../entities/branch.entity';

export interface BranchRepository
  extends Repository<Branch>
{
  findByCode(
    organizationId: string,
    code: string,
  ): Promise<Branch | null>;
}