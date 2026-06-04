export type NotificationType =
  | "USER_FOLLOWED"
  | "CAT_FOLLOWED"
  | "POST_LIKE"
  | "COMMENT_CREATED";

export type NotificationPayload =
  | { type: "USER_FOLLOWED"; followerId: string }
  | { type: "CAT_FOLLOWED"; followerId: string; catId: string }
  | { type: "POST_LIKE"; actorId: string; postId: string }
  | { type: "COMMENT_CREATED"; actorId: string; postId: string; commentId: string };

export interface Notification {
  id: string;
  userId: string;
  title: string | null;
  body: string | null;
  data: NotificationPayload | null;
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
