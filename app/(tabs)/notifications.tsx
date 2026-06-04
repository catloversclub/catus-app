import {
  notificationKeys,
  useDeleteNotificationMutation,
  useNotificationsQuery,
} from "@/api/domains/notification/queries";
import { type Notification } from "@/api/domains/notification/types";
import NotificationItem, {
  type NotificationData,
} from "@/components/notifications/notification-item";
import { useDefaultStackScreenOptions } from "@/hooks/use-default-screen-options";
import {
  useFollowUserMutation,
  useUnfollowUserMutation,
} from "@/api/domains/user/queries";
import { formatRelativeTime } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { Suspense } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

const buildMessage = (n: Notification): string => {
  if (!n.data) return n.body ?? n.title ?? "";
  switch (n.data.type) {
    case "POST_LIKE":
      return `${n.title} ${n.body}`;
    case "COMMENT_CREATED":
      return n.title ?? "";
    case "USER_FOLLOWED":
    case "CAT_FOLLOWED":
      return n.body ?? "";
  }
};

const getActorId = (payload: Notification["data"]): string => {
  if (!payload) return "";
  if (payload.type === "USER_FOLLOWED" || payload.type === "CAT_FOLLOWED") {
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

const NotificationList = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useNotificationsQuery();
  const queryClient = useQueryClient();
  const { mutate: deleteNotif } = useDeleteNotificationMutation();
  const { mutate: follow } = useFollowUserMutation();
  const { mutate: unfollow } = useUnfollowUserMutation();

  const rawList = data.pages.flat();
  const notifications = rawList
    .map(toNotificationData)
    .filter(Boolean) as NotificationData[];

  const handleFollowToggle = (id: string) => {
    const item = rawList.find((n) => n.id === id);
    if (!item?.data) return;
    const actorId = getActorId(item.data);
    const mapped = notifications.find((n) => n.id === id);
    const invalidate = () =>
      queryClient.invalidateQueries({ queryKey: notificationKeys.list() });
    if (mapped?.isFollowing) {
      unfollow(actorId, { onSuccess: invalidate });
    } else {
      follow(actorId, { onSuccess: invalidate });
    }
  };

  if (notifications.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-semantic-bg-primary">
        <Text className="typo-body1 text-semantic-text-primary">
          아직 알림이 없어요.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      className="flex-1 bg-semantic-bg-primary"
      data={notifications}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <NotificationItem
          item={item}
          onDelete={deleteNotif}
          onFollowToggle={handleFollowToggle}
        />
      )}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingTop: 19 }}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) fetchNextPage();
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingNextPage ? (
          <ActivityIndicator size="small" style={{ marginVertical: 12 }} />
        ) : null
      }
    />
  );
};

const NotificationsScreen = () => {
  const defaultOptions = useDefaultStackScreenOptions();

  return (
    <>
      <Stack.Screen
        options={{ ...defaultOptions, title: "알림", headerLeft: undefined }}
      />
      <Suspense fallback={<View className="flex-1 bg-semantic-bg-primary" />}>
        <NotificationList />
      </Suspense>
    </>
  );
};

export default NotificationsScreen;
