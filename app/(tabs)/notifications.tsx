import NotificationItem, {
  type NotificationData,
} from "@/components/notifications/notification-item";
import { useColors } from "@/hooks/use-colors";
import { Stack } from "expo-router";
import { useState } from "react";
import { FlatList, Text, View } from "react-native";

const MOCK_NOTIFICATIONS: NotificationData[] = [
  {
    id: "1",
    type: "follow_me",
    actor: { id: "1", name: "나만고양이없어", imageUrl: null },
    isFollowing: true,
    timestamp: "2분 전",
  },
  {
    id: "2",
    type: "follow_cat",
    actor: { id: "2", name: "히사시부리", imageUrl: null },
    catName: "김요모",
    isFollowing: true,
    timestamp: "4시간 전",
  },
  {
    id: "3",
    type: "like",
    actor: { id: "3", name: "히사시부리", imageUrl: null },
    isFollowing: false,
    timestamp: "어제",
  },
  {
    id: "4",
    type: "comment",
    actor: { id: "4", name: "히사시부리", imageUrl: null },
    isFollowing: false,
    timestamp: "2일 전",
  },
  {
    id: "5",
    type: "follow_cat",
    actor: { id: "5", name: "밍밍", imageUrl: null },
    catName: "김요모조모",
    isFollowing: true,
    timestamp: "3일 전",
  },
  {
    id: "6",
    type: "comment",
    actor: { id: "6", name: "밍밍", imageUrl: null },
    isFollowing: false,
    timestamp: "1주 전",
  },
];

const NotificationsScreen = () => {
  const { colors } = useColors();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleFollowToggle = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isFollowing: !n.isFollowing } : n)),
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerShadowVisible: false,
          title: "알림",
          headerTintColor: colors.text.primary,
          headerStyle: { backgroundColor: colors.bg.primary },
        }}
      />

      {notifications.length === 0 ? (
        <View className="flex-1 items-center justify-center bg-semantic-bg-primary">
          <Text className="typo-body1 text-semantic-text-primary">
            아직 알림이 없어요.
          </Text>
        </View>
      ) : (
        <FlatList
          className="flex-1 bg-semantic-bg-primary"
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NotificationItem
              item={item}
              onDelete={handleDelete}
              onFollowToggle={handleFollowToggle}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 19 }}
        />
      )}
    </>
  );
}

export default NotificationsScreen;
