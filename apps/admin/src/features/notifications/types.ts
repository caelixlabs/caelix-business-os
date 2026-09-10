export interface NotificationItem {
  id: string;
  organizationId: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  metadata?: Record<string, unknown>;
  readAt: string | null;
  createdAt: string;
}
