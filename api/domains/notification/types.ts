export interface Notification {
  id: string;
  userId: string;
  title: string | null;
  body: string | null;
  data: Record<string, unknown> | null;
  readAt: string;
  createdAt: string;
}

export interface PushToken {
  token: string;
  platform: "ios" | "android";
  enabled: boolean;
  lastUsedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetNotificationsParams {
  cursor?: string;
  take?: number;
}
