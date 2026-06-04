import DeleteIcon from "@/assets/icons/delete.svg";
import { type NotificationType } from "@/api/domains/notification/types";
import FollowButton from "@/components/user/follow-button";
import UserProfileImage from "@/components/user/profile-image";
import { useRef } from "react";
import { Pressable, Text, View } from "react-native";
import ReanimatedSwipeable, {
  type SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";

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
}

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
        {item.type === "USER_FOLLOWED" && (
          <FollowButton userId={item.actorId} isFollowing={item.isFollowing} />
        )}
      </View>
    </ReanimatedSwipeable>
  );
};

export default NotificationItem;
