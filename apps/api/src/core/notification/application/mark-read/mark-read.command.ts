export class MarkNotificationReadCommand {
  constructor(
    public readonly id: string,
    public readonly userId: string,
  ) {}
}

export class MarkAllNotificationsReadCommand {
  constructor(public readonly userId: string) {}
}