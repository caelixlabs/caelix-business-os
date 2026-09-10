export class ActivateBranchCommand {
  constructor(
    public readonly id: string, 
    public readonly organizationId: string
  ) {}
}
