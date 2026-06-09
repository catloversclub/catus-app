import {
  useMyBookmarkedPostsQuery,
  useMyLikedPostsQuery,
  useMyPostsQuery,
} from "@/api/domains/post/queries";
import TabIconBar from "@/components/layout/tab-icon-bar";
import PostGrid from "@/components/post/grid";
import { SuspenseWithDelay } from "@/components/ui/suspense-with-delay";
import MyProfileHeaderContent from "@/components/user/mypage/my-profile-header-content";
import { ProfileHeaderSkeleton } from "@/components/user/profile/profile-header";
import { useState } from "react";
import { RefreshControl } from "react-native";

const EMPTY_MESSAGES = [
  "게시글이 없어요",
  "좋아요한 게시글이 없어요",
  "저장한 게시글이 없어요",
];

const ProfileHeader = () => (
  <SuspenseWithDelay fallback={<ProfileHeaderSkeleton />}>
    <MyProfileHeaderContent />
  </SuspenseWithDelay>
);

interface MypagePostGridProps {
  refreshing: boolean;
  onRefresh: () => void;
}

const MypagePostGrid = ({ refreshing, onRefresh }: MypagePostGridProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const myPostsQuery = useMyPostsQuery();
  const likedQuery = useMyLikedPostsQuery();
  const bookmarkedQuery = useMyBookmarkedPostsQuery();

  const queries = [myPostsQuery, likedQuery, bookmarkedQuery];
  const activeQuery = queries[activeTab];
  const posts = activeQuery.data.pages.flat();

  return (
    <PostGrid
      posts={posts}
      isFetchingNextPage={activeQuery.isFetchingNextPage}
      emptyMessage={EMPTY_MESSAGES[activeTab]}
      ListHeaderComponent={ProfileHeader}
      tabBar={<TabIconBar activeIndex={activeTab} onChange={setActiveTab} />}
      scrollEnabled
      onEndReached={() => {
        if (activeQuery.hasNextPage && !activeQuery.isFetchingNextPage) {
          activeQuery.fetchNextPage();
        }
      }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    />
  );
};

export default MypagePostGrid;
