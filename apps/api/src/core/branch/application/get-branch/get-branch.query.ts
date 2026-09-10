export class GetBranchQuery {
  constructor(
    public readonly id: string,
    public readonly organizationId: string,
  ) {}
}