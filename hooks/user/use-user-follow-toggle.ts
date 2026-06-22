import {
  useFollowUserMutation,
  useUnfollowUserMutation,
} from "@/api/domains/user/queries";
import { useCallback } from "react";

interface UseUserFollowToggleOptions {
  userId: string;
  isFollowing: boolean;
  onUnfollowStart?: () => void;
}

const useUserFollowToggle = ({
  userId,
  isFollowing,
  onUnfollowStart,
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

  const unfollowWithCats = useCallback(
    (catIds: string[]) => {
      unfollowUser({ userId, catIds });
    },
    [unfollowUser, userId],
  );

  const toggleFollow = useCallback(() => {
    if (isFollowing) {
      if (onUnfollowStart) {
        onUnfollowStart();
        return;
      }

      unfollowUser(userId);
      return;
    }

    followUser(userId);
  }, [followUser, isFollowing, onUnfollowStart, unfollowUser, userId]);

  return {
    followWithCats,
    unfollowWithCats,
    toggleFollow,
    isPending: isFollowPending || isUnfollowPending,
  };
};

export { useUserFollowToggle };
