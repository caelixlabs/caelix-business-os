import { CreateBranchDto } from './create-branch.dto';

export class CreateBranchCommand {
  constructor(
    public readonly organizationId: string,
    public readonly dto: CreateBranchDto,
  ) {}
}
