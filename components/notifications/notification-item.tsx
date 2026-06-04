import DeleteIcon from "@/assets/icons/delete.svg";
import { type Notification } from "@/api/domains/notification/types";
import FollowButton from "@/components/user/follow-button";
import UserProfileImage from "@/components/user/profile-image";
import { formatRelativeTime } from "@/lib/utils";
import { useRef } from "react";
import { Pressable, Text, View } from "react-native";
import ReanimatedSwipeable, {
  type SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";

interface NotificationItemProps {
  item: Notification;
  onDelete: (id: string) => void;
}

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

const getActorId = (n: Notification): string => {
  if (!n.data) return "";
  if (n.data.type === "USER_FOLLOWED") return n.data.followerId;
  return n.data.actorId;
};

const NotificationItem = ({ item, onDelete }: NotificationItemProps) => {
  const swipeableRef = useRef<SwipeableMethods | null>(null);

  const handleDelete = () => {
    swipeableRef.current?.close();
    onDelete(item.id);
  };

  const renderRightActions = () => (
    <Pressable
      onPress={handleDelete}
      className="w-[68px] items-center justify-center bg-red-500"
    >
      <DeleteIcon width={20} height={20} color="white" />
    </Pressable>
  );

  return (
    <ReanimatedSwipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      rightThreshold={40}
      overshootRight={false}
      friction={1}
      overshootFriction={8}
      dragOffsetFromLeftEdge={0}
    >
      <View className="flex-row items-center h-[92px] px-3 gap-3 bg-semantic-bg-primary border-b border-semantic-border-primary">
        <UserProfileImage imageUrl={null} size="sm" />
        <View className="flex-1 gap-1.5">
          <Text
            className="typo-body3 text-semantic-text-primary"
            numberOfLines={2}
          >
            {buildMessage(item)}
          </Text>
          <Text className="typo-label1 text-semantic-text-tertiary">
            {formatRelativeTime(item.createdAt)}
          </Text>
        </View>
        {item.data?.type === "USER_FOLLOWED" && (
          <FollowButton userId={getActorId(item)} isFollowing={false} />
        )}
      </View>
    </ReanimatedSwipeable>
  );
};

export default NotificationItem;
