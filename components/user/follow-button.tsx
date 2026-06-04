import {
  useFollowUserMutation,
  useUnfollowUserMutation,
} from "@/api/domains/user/queries";
import { Text, TouchableOpacity } from "react-native";

interface FollowButtonProps {
  userId: string;
  isFollowing: boolean;
}

const FollowButton = ({ userId, isFollowing }: FollowButtonProps) => {
  const { mutate: follow, isPending: isFollowPending } =
    useFollowUserMutation();
  const { mutate: unfollow, isPending: isUnfollowPending } =
    useUnfollowUserMutation();
  const isPending = isFollowPending || isUnfollowPending;

  const handleToggle = () => {
    if (isFollowing) {
      unfollow(userId);
    } else {
      follow(userId);
    }
  };

  return (
    <TouchableOpacity
      onPress={handleToggle}
      disabled={isPending}
      className="border border-semantic-border-primary rounded px-4 py-1.5 items-center justify-center"
      style={{ width: 68, height: 34 }}
    >
      <Text className="typo-body3 text-semantic-text-secondary">
        {isFollowing ? "팔로잉" : "팔로우"}
      </Text>
    </TouchableOpacity>
  );
};

export default FollowButton;
