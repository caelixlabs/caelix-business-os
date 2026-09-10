export class ListNotificationsQuery {
  constructor(
    public readonly userId: string,
    public readonly page: number = 1,
    public readonly limit: number = 20,
  ) {}
}
