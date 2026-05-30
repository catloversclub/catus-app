import DeleteIcon from "@/assets/icons/delete.svg";
import ProfileImage from "@/components/common/profile-image";
import { useRef } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import ReanimatedSwipeable, {
  type SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";

export type NotificationType = "follow_me" | "follow_cat" | "like" | "comment";

export interface NotificationData {
  id: string;
  type: NotificationType;
  actor: { id: string; name: string; imageUrl: string | null };
  catName?: string;
  isFollowing: boolean;
  timestamp: string;
}

interface NotificationItemProps {
  item: NotificationData;
  onDelete: (id: string) => void;
  onFollowToggle: (id: string) => void;
}

const getMessage = (item: NotificationData): string => {
  switch (item.type) {
    case "follow_me":
      return `${item.actor.name} 님이 나를 팔로우했어요.`;
    case "follow_cat":
      return `${item.actor.name} 님이 ${item.catName}를 팔로우했어요.`;
    case "like":
      return `${item.actor.name} 님이 내 게시물에 좋아요를 눌렀어요.`;
    case "comment":
      return `${item.actor.name} 님이 내 게시물에 댓글을 달았어요.`;
  }
}

const isFollowType = (type: NotificationType) =>
  type === "follow_me" || type === "follow_cat";

const NotificationItem = ({
  item,
  onDelete,
  onFollowToggle,
}: NotificationItemProps) => {
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
    >
      <View className="flex-row items-center h-[92px] px-6 gap-3 bg-semantic-bg-primary border-b border-semantic-border-primary">
        <ProfileImage imageUrl={item.actor.imageUrl} size="sm" />
        <View className="flex-1 gap-1.5">
          <Text
            className="typo-body3 text-semantic-text-primary"
            numberOfLines={2}
          >
            {getMessage(item)}
          </Text>
          <Text className="typo-label1 text-semantic-text-tertiary">
            {item.timestamp}
          </Text>
        </View>
        {isFollowType(item.type) && (
          <TouchableOpacity
            onPress={() => onFollowToggle(item.id)}
            className="border border-semantic-border-primary rounded px-4 py-1.5 items-center justify-center"
            style={{ width: 68, height: 34 }}
          >
            <Text className="typo-body3 text-semantic-text-secondary">
              {item.isFollowing ? "팔로잉" : "팔로우"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ReanimatedSwipeable>
  );
};

export default NotificationItem;
