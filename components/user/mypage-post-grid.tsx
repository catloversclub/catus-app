import {
  useMyBookmarkedPostsQuery,
  useMyLikedPostsQuery,
  useMyPostsQuery,
} from "@/api/domains/post/queries";
import TabIconBar from "@/components/layout/tab-icon-bar";
import ProfilePostGrid from "@/components/user/profile-post-grid";

const EMPTY_MESSAGES = [
  "게시글이 없어요",
  "좋아요한 게시글이 없어요",
  "저장한 게시글이 없어요",
];

interface MypagePostGridProps {
  activeTab: number;
  onTabChange: (i: number) => void;
  loadMoreRef: React.RefObject<(() => void) | null>;
}

const MypagePostGrid = ({
  activeTab,
  onTabChange,
  loadMoreRef,
}: MypagePostGridProps) => {
  const myPostsQuery = useMyPostsQuery();
  const likedQuery = useMyLikedPostsQuery();
  const bookmarkedQuery = useMyBookmarkedPostsQuery();

  const queries = [myPostsQuery, likedQuery, bookmarkedQuery];
  const activeQuery = queries[activeTab];
  const posts = activeQuery.data.pages.flat();

  loadMoreRef.current = () => {
    if (activeQuery.hasNextPage && !activeQuery.isFetchingNextPage) {
      activeQuery.fetchNextPage();
    }
  };

  return (
    <ProfilePostGrid
      tabBar={<TabIconBar activeIndex={activeTab} onChange={onTabChange} />}
      posts={posts}
      isFetchingNextPage={activeQuery.isFetchingNextPage}
      hasNextPage={activeQuery.hasNextPage}
      fetchNextPage={activeQuery.fetchNextPage}
      emptyMessage={EMPTY_MESSAGES[activeTab]}
      scrollEnabled={false}
    />
  );
};

export default MypagePostGrid;
