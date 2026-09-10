export interface CreateNotificationParams {
  organizationId: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  metadata?: Record<string, unknown>;
}

export interface NotificationRecord extends CreateNotificationParams {
  id: string;
  readAt: Date | null;
  createdAt: Date;
}

export interface NotificationRepository {
  create(params: CreateNotificationParams): Promise<void>;
  createMany(params: CreateNotificationParams[]): Promise<void>;

  listForUser(
    userId: string,
    pagination: { skip: number; take: number },
  ): Promise<{ items: NotificationRecord[]; total: number; unreadCount: number }>;

  markRead(id: string, userId: string): Promise<void>;
  markAllRead(userId: string): Promise<void>;
}
