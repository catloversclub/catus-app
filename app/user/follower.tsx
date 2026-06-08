import { useUserProfileQuery } from "@/api/domains/user/queries";
import {
  FollowListSkeleton,
  FollowerList,
} from "@/components/user/profile/follow-list";
import { SuspenseWithDelay } from "@/components/ui/suspense-with-delay";

const MyFollowerContent = () => {
  const { data: me } = useUserProfileQuery();
  return <FollowerList userId={me.id} />;
};

const Follower = () => (
  <SuspenseWithDelay fallback={<FollowListSkeleton />}>
    <MyFollowerContent />
  </SuspenseWithDelay>
);

export default Follower;
