export class Organization {
  constructor(
    public readonly id: string | null,
    public readonly name: string,
    public readonly slug: string,
    public readonly description?: string,
  ) {}
}