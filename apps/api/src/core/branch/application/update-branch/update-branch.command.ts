import { UpdateBranchDto } from './update-branch.dto';

export class UpdateBranchCommand {
  constructor(
    public readonly id: string,
    public readonly organizationId: string,
    public readonly dto: UpdateBranchDto,
  ) {}
}
