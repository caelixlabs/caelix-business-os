export class AssignBranchCommand {
  constructor(
    public readonly userId: string,
    public readonly organizationId: string,
    public readonly branchId?: string,
  ) {}
}