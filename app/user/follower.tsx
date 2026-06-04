import { useUserProfileQuery } from "@/api/domains/user/queries";
import {
  FollowListSkeleton,
  FollowerList,
} from "@/components/user/profile/follow-list";
import { Suspense } from "react";

const MyFollowerContent = () => {
  const { data: me } = useUserProfileQuery();
  return <FollowerList userId={me.id} />;
};

const Follower = () => (
  <Suspense fallback={<FollowListSkeleton />}>
    <MyFollowerContent />
  </Suspense>
);

export default Follower;
