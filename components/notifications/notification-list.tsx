import {
  useDeleteNotificationMutation,
  useNotificationsQuery,
} from "@/api/domains/notification/queries";
import { Skeleton } from "@/components/ui/skeleton";
import { ActivityIndicator, Text, View } from "react-native";
import NotificationItem from "./notification-item";

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
  <View className="flex-row items-start p-3 bg-semantic-bg-primary">
    <Skeleton className="rounded-full" style={{ width: 36, height: 36 }} />
    <View style={{ width: 12 }} />
    <View className="flex-1 gap-1.5">
      <Skeleton
        className="rounded"
        style={{ width: messageWidth, height: 14 }}
      />
      <Skeleton className="rounded" style={{ width: 60, height: 11 }} />
    </View>
    {hasButton && (
      <>
        <View style={{ width: 8 }} />
        <Skeleton className="rounded" style={{ width: 68, height: 34 }} />
      </>
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

interface NotificationListProps {
  loadMoreRef: React.RefObject<(() => void) | null>;
}

const NotificationList = ({ loadMoreRef }: NotificationListProps) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useNotificationsQuery();
  const { mutate: deleteNotif } = useDeleteNotificationMutation();

  const notifications = data.pages.flat();

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
