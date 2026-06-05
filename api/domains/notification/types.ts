export type NotificationType =
  | "USER_FOLLOWED"
  | "CAT_FOLLOWED"
  | "FOLLOWED_CAT_POST_CREATED"
  | "COMMENT_LIKE"
  | "POST_LIKE"
  | "COMMENT_CREATED"
  | "REPLY_CREATED"
  | "NOTICE"
  | "DEV_TEST_NOTIFICATION";

export type NotificationPayload =
  | { type: "USER_FOLLOWED"; followerId: string }
  | { type: "CAT_FOLLOWED"; followerId: string; catId: string }
  | { type: "FOLLOWED_CAT_POST_CREATED"; catId: string; postId: string }
  | { type: "COMMENT_LIKE"; actorId: string; postId: string; commentId: string }
  | { type: "POST_LIKE"; actorId: string; postId: string }
  | {
      type: "COMMENT_CREATED";
      actorId: string;
      postId: string;
      commentId: string;
    }
  | {
      type: "REPLY_CREATED";
      actorId: string;
      postId: string;
      commentId: string;
      parentCommentId: string;
    }
  | { type: "NOTICE"; noticeId?: string }
  | { type: "DEV_TEST_NOTIFICATION" };

export interface NotificationActor {
  id: string;
  imageUrl: string | null;
}

export interface Notification {
  id: string;
  userId: string;
  title: string | null;
  body: string | null;
  data: NotificationPayload | null;
  readAt: string | null;
  createdAt: string;
  actor: NotificationActor | null;
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

export interface DeleteNotificationResponse {
  id: string;
  deleted: boolean;
}

export interface TestNotificationResponse {
  tokenCount: number;
  validTokenCount: number;
  tickets: unknown[];
}

export interface NotificationSettings {
  all: boolean;
  likes: boolean;
  comments: boolean;
  replies: boolean;
  newFollowers: boolean;
  marketing: boolean;
}
