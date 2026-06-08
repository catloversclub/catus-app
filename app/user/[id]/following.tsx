import {
  FollowListSkeleton,
  FollowingList,
} from "@/components/user/profile/follow-list";
import { SuspenseWithDelay } from "@/components/ui/suspense-with-delay";
import { useLocalSearchParams } from "expo-router";

const UserFollowingContent = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <FollowingList userId={id} />;
};

const UserFollowing = () => (
  <SuspenseWithDelay fallback={<FollowListSkeleton />}>
    <UserFollowingContent />
  </SuspenseWithDelay>
);

export default UserFollowing;
