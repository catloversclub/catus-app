import DeleteIcon from "@/assets/icons/delete.svg";
import UserProfileImage from "@/components/user/profile-image";
import { useRef } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import ReanimatedSwipeable, {
  type SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";

export type NotificationType =
  | "USER_FOLLOWED"
  | "CAT_FOLLOWED"
  | "POST_LIKE"
  | "COMMENT_CREATED";

export interface NotificationData {
  id: string;
  type: NotificationType;
  actorId: string;
  actorImageUrl: string | null;
  message: string;
  isFollowing: boolean;
  timestamp: string;
}

interface NotificationItemProps {
  item: NotificationData;
  onDelete: (id: string) => void;
  onFollowToggle: (id: string) => void;
}

const isFollowType = (type: NotificationType) =>
  type === "USER_FOLLOWED" || type === "CAT_FOLLOWED";

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
      friction={1} // 1 = 1:1 추적 (기본값 2는 느림)
      overshootFriction={8} // rubber band 강도
      dragOffsetFromLeftEdge={0}
    >
      <View className="flex-row items-center h-[92px] px-3 gap-3 bg-semantic-bg-primary border-b border-semantic-border-primary">
        <UserProfileImage imageUrl={item.actorImageUrl} size="sm" />
        <View className="flex-1 gap-1.5">
          <Text
            className="typo-body3 text-semantic-text-primary"
            numberOfLines={2}
          >
            {item.message}
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
