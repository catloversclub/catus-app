import { useUserProfileQuery } from "@/api/domains/user/queries";
import {
  FollowListSkeleton,
  FollowingList,
} from "@/components/user/profile/follow-list";
import { Suspense } from "react";

const MyFollowingContent = () => {
  const { data: me } = useUserProfileQuery();
  return <FollowingList userId={me.id} />;
};

const Following = () => (
  <Suspense fallback={<FollowListSkeleton />}>
    <MyFollowingContent />
  </Suspense>
);

export default Following;
