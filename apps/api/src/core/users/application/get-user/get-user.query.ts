export class GetUserQuery {
  constructor(
    public readonly id: string,
    public readonly organizationId: string
  ) {}
}
