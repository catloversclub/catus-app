import {
  FollowListSkeleton,
  FollowerList,
} from "@/components/user/profile/follow-list";
import { SuspenseWithDelay } from "@/components/ui/suspense-with-delay";
import { useLocalSearchParams } from "expo-router";

const UserFollowerContent = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <FollowerList userId={id} />;
};

const UserFollower = () => (
  <SuspenseWithDelay fallback={<FollowListSkeleton />}>
    <UserFollowerContent />
  </SuspenseWithDelay>
);

export default UserFollower;
