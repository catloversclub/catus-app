import {
  useFollowUserMutation,
  useUnfollowUserMutation,
} from "@/api/domains/user/queries";
import { useCallback } from "react";

interface UseUserFollowToggleOptions {
  userId: string;
  isFollowing: boolean;
  onFollowStart?: () => void;
}

const useUserFollowToggle = ({
  userId,
  isFollowing,
  onFollowStart,
}: UseUserFollowToggleOptions) => {
  const { mutate: followUser, isPending: isFollowPending } =
    useFollowUserMutation();
  const { mutate: unfollowUser, isPending: isUnfollowPending } =
    useUnfollowUserMutation();

  const followWithCats = useCallback(
    (catIds: string[]) => {
      followUser({ userId, catIds });
    },
    [followUser, userId],
  );

  const toggleFollow = useCallback(() => {
    if (isFollowing) {
      unfollowUser(userId);
      return;
    }

    if (onFollowStart) {
      onFollowStart();
      return;
    }

    followUser(userId);
  }, [followUser, isFollowing, onFollowStart, unfollowUser, userId]);

  return {
    followWithCats,
    toggleFollow,
    isPending: isFollowPending || isUnfollowPending,
  };
};

export { useUserFollowToggle };
