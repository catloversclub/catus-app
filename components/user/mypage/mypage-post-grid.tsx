import {
  useMyBookmarkedPostsQuery,
  useMyLikedPostsQuery,
  useMyPostsQuery,
} from "@/api/domains/post/queries";
import TabIconBar from "@/components/layout/tab-icon-bar";
import PostGrid from "@/components/post/grid";
import { useTabSwipe } from "@/hooks/use-tab-swipe";
import { GestureDetector } from "react-native-gesture-handler";
import { View } from "react-native";
import Animated from "react-native-reanimated";

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

  const { renderTab, animatedStyle, panGesture, switchTab } = useTabSwipe({
    tabCount: queries.length,
    activeTab,
    onTabChange,
  });

  const activeQuery = queries[renderTab];
  const posts = activeQuery.data.pages.flat();

  return (
    <View>
      <TabIconBar activeIndex={activeTab} onChange={switchTab} />
      <GestureDetector gesture={panGesture}>
        <View style={{ overflow: "hidden" }}>
          <Animated.View style={animatedStyle}>
            <PostGrid
              posts={posts}
              isFetchingNextPage={activeQuery.isFetchingNextPage}
              hasNextPage={activeQuery.hasNextPage}
              fetchNextPage={activeQuery.fetchNextPage}
              emptyMessage={EMPTY_MESSAGES[renderTab]}
              loadMoreRef={loadMoreRef}
            />
          </Animated.View>
        </View>
      </GestureDetector>
    </View>
  );
};

export default MypagePostGrid;
