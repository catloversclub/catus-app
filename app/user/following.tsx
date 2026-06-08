import { useUserProfileQuery } from "@/api/domains/user/queries";
import {
  FollowListSkeleton,
  FollowingList,
} from "@/components/user/profile/follow-list";
import { SuspenseWithDelay } from "@/components/ui/suspense-with-delay";

const MyFollowingContent = () => {
  const { data: me } = useUserProfileQuery();
  return <FollowingList userId={me.id} />;
};

const Following = () => (
  <SuspenseWithDelay fallback={<FollowListSkeleton />}>
    <MyFollowingContent />
  </SuspenseWithDelay>
);

export default Following;
