export class DeleteBranchCommand {
  constructor(
    public readonly id: string,
    public readonly organizationId: string
  ) {}
}
