import {
  FollowListSkeleton,
  FollowerList,
} from "@/components/user/profile/follow-list";
import { useLocalSearchParams } from "expo-router";
import { Suspense } from "react";

const UserFollowerContent = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <FollowerList userId={id} />;
};

const UserFollower = () => (
  <Suspense fallback={<FollowListSkeleton />}>
    <UserFollowerContent />
  </Suspense>
);

export default UserFollower;
