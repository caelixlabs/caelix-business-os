export class AssignRoleCommand {
  constructor(
    public readonly userId: string,
    public readonly organizationId: string,
    public readonly roleId: string,
  ) {}
}
