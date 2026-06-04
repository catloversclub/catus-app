import { type Notification } from "@/api/domains/notification/types";
import DeleteIcon from "@/assets/icons/trash.svg";
import FollowButton from "@/components/user/follow-button";
import UserProfileImage from "@/components/user/profile-image";
import { ROUTES } from "@/constants/route";
import { formatRelativeTime } from "@/lib/utils";
import { router } from "expo-router";
import { ReactNode, useRef } from "react";
import { Pressable, Text, View } from "react-native";
import ReanimatedSwipeable, {
  type SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from "react-native-reanimated";

interface NotificationItemProps {
  item: Notification;
  onDelete: (id: string) => void;
}

interface RightActionsProps {
  progress: SharedValue<number>;
  drag: SharedValue<number>;
  onDelete: () => void;
}

const DELETE_ACTION_WIDTH = 68;
const FULL_SWIPE_THRESHOLD = 1.5;

const getActorId = (n: Notification): string => {
  if (!n.data) return "";
  if (n.data.type === "USER_FOLLOWED") return n.data.followerId;
  return n.data.actorId;
};

const renderMessage = (
  n: Notification,
  onActorPress: () => void,
): ReactNode => {
  if (!n.data) return n.body ?? n.title ?? "";

  const ActorName = ({ name }: { name: string }) => (
    <Text onPress={onActorPress} suppressHighlighting>
      {name}
    </Text>
  );

  switch (n.data.type) {
    case "POST_LIKE":
    case "COMMENT_LIKE":
      return (
        <>
          <ActorName name={n.title ?? ""} />
          {` ${n.body}`}
        </>
      );
    case "COMMENT_CREATED": {
      const raw = n.title ?? "";
      const idx = raw.indexOf("님이");
      const name = idx > 0 ? raw.slice(0, idx) : raw;
      const rest = idx > 0 ? raw.slice(idx) : "";
      return (
        <>
          <ActorName name={name} />
          {rest}
        </>
      );
    }
    case "USER_FOLLOWED": {
      const raw = n.body ?? "";
      const idx = raw.indexOf("님이");
      const name = idx > 0 ? raw.slice(0, idx) : raw;
      const rest = idx > 0 ? raw.slice(idx) : "";
      return (
        <>
          <ActorName name={name} />
          {rest}
        </>
      );
    }
  }
};

const RightActions = ({ progress, drag, onDelete }: RightActionsProps) => {
  const triggered = useSharedValue(false);

  useAnimatedReaction(
    () => progress.value,
    (value) => {
      if (value > FULL_SWIPE_THRESHOLD && !triggered.value) {
        triggered.value = true;
        runOnJS(onDelete)();
      }
    },
  );

  const animatedStyle = useAnimatedStyle(() => ({
    width:
      -drag.value > DELETE_ACTION_WIDTH ? -drag.value : DELETE_ACTION_WIDTH,
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onDelete}
        style={{ flex: 1 }}
        className="items-center justify-center rounded-r-lg bg-semantic-border-error"
      >
        <DeleteIcon width={20} height={20} color="white" />
      </Pressable>
    </Animated.View>
  );
};

const NotificationItem = ({ item, onDelete }: NotificationItemProps) => {
  const swipeableRef = useRef<SwipeableMethods | null>(null);
  const actorId = getActorId(item);

  const handleDelete = () => {
    swipeableRef.current?.close();
    onDelete(item.id);
  };

  const handleContentPress = () => {
    if (!item.data) return;
    if (item.data.type === "USER_FOLLOWED") {
      router.push(ROUTES.USER.DETAIL(item.data.followerId));
    } else {
      router.push(ROUTES.POST.DETAIL(item.data.postId));
    }
  };

  const handleActorPress = () => router.push(ROUTES.USER.DETAIL(actorId));

  const renderRightActions = (
    progress: SharedValue<number>,
    drag: SharedValue<number>,
  ) => <RightActions progress={progress} drag={drag} onDelete={handleDelete} />;

  return (
    <ReanimatedSwipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      rightThreshold={40}
      overshootRight={true}
      friction={1}
      dragOffsetFromLeftEdge={0}
    >
      <Pressable
        onPress={handleContentPress}
        className="flex-row items-start p-3  bg-semantic-bg-primary border-semantic-border-primary"
      >
        <UserProfileImage imageUrl={null} userId={actorId} size="sm" />
        <View className="w-3" />
        <View className="flex-1 gap-1.5">
          <Text
            className="typo-body3 text-semantic-text-primary"
            numberOfLines={2}
          >
            {renderMessage(item, handleActorPress)}
          </Text>
          <Text className="typo-label1 text-semantic-text-tertiary">
            {formatRelativeTime(item.createdAt)}
          </Text>
        </View>

        {item.data?.type === "USER_FOLLOWED" && (
          <>
            <View className="w-2" />
            <FollowButton userId={actorId} isFollowing={false} />
          </>
        )}
      </Pressable>
    </ReanimatedSwipeable>
  );
};

export default NotificationItem;
