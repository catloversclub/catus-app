import {
  useDeleteNotificationMutation,
  useNotificationsQuery,
} from "@/api/domains/notification/queries";
import { type Notification } from "@/api/domains/notification/types";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRelativeTime } from "@/lib/utils";
import { ActivityIndicator, Text, View } from "react-native";
import NotificationItem, { type NotificationData } from "./notification-item";

const SKELETON_ROWS = [
  { messageWidth: 210, hasButton: true },
  { messageWidth: 180, hasButton: false },
  { messageWidth: 200, hasButton: false },
  { messageWidth: 160, hasButton: true },
  { messageWidth: 190, hasButton: false },
  { messageWidth: 170, hasButton: false },
] as const;

interface NotificationItemSkeletonProps {
  messageWidth: number;
  hasButton: boolean;
}

const NotificationItemSkeleton = ({
  messageWidth,
  hasButton,
}: NotificationItemSkeletonProps) => (
  <View className="flex-row items-center h-[92px] px-3 gap-3 border-b border-semantic-border-primary">
    <Skeleton className="rounded-full" style={{ width: 36, height: 36 }} />
    <View className="flex-1 gap-1.5">
      <Skeleton
        className="rounded"
        style={{ width: messageWidth, height: 14 }}
      />
      <Skeleton className="rounded" style={{ width: 60, height: 11 }} />
    </View>
    {hasButton && (
      <Skeleton className="rounded" style={{ width: 68, height: 34 }} />
    )}
  </View>
);

const NotificationListSkeleton = () => (
  <View className="flex-1 bg-semantic-bg-primary" style={{ paddingTop: 19 }}>
    {SKELETON_ROWS.map((row, i) => (
      <NotificationItemSkeleton key={i} {...row} />
    ))}
  </View>
);

const buildMessage = (n: Notification): string => {
  if (!n.data) return n.body ?? n.title ?? "";
  switch (n.data.type) {
    case "POST_LIKE":
    case "COMMENT_LIKE":
      return `${n.title} ${n.body}`;
    case "COMMENT_CREATED":
      return n.title ?? "";
    case "USER_FOLLOWED":
      return n.body ?? "";
  }
};

const getActorId = (payload: Notification["data"]): string => {
  if (!payload) return "";
  if (payload.type === "USER_FOLLOWED") {
    return payload.followerId;
  }
  return payload.actorId;
};

const toNotificationData = (n: Notification): NotificationData | null => {
  if (!n.data) return null;
  return {
    id: n.id,
    type: n.data.type,
    actorId: getActorId(n.data),
    actorImageUrl: null,
    message: buildMessage(n),
    isFollowing: false,
    timestamp: formatRelativeTime(n.createdAt),
  };
};

interface NotificationListProps {
  loadMoreRef: React.RefObject<(() => void) | null>;
}

const NotificationList = ({ loadMoreRef }: NotificationListProps) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useNotificationsQuery();
  const { mutate: deleteNotif } = useDeleteNotificationMutation();

  const notifications = data.pages
    .flat()
    .map(toNotificationData)
    .filter(Boolean) as NotificationData[];

  loadMoreRef.current = () => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  };

  if (notifications.length === 0) {
    return (
      <View
        className="flex-1 items-center justify-center bg-semantic-bg-primary"
        style={{ paddingTop: 120 }}
      >
        <Text className="typo-body1 text-semantic-text-primary">
          아직 알림이 없어요.
        </Text>
      </View>
    );
  }

  return (
    <View>
      {notifications.map((item) => (
        <NotificationItem key={item.id} item={item} onDelete={deleteNotif} />
      ))}
      {isFetchingNextPage && (
        <ActivityIndicator size="small" style={{ marginVertical: 12 }} />
      )}
    </View>
  );
};

export { NotificationList, NotificationListSkeleton };
