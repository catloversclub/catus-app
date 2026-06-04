import {
  FollowListSkeleton,
  FollowingList,
} from "@/components/user/profile/follow-list";
import { useLocalSearchParams } from "expo-router";
import { Suspense } from "react";

const UserFollowingContent = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <FollowingList userId={id} />;
};

const UserFollowing = () => (
  <Suspense fallback={<FollowListSkeleton />}>
    <UserFollowingContent />
  </Suspense>
);

export default UserFollowing;
