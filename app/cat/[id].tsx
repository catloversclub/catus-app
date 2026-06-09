import {
  useAppearanceQuery,
  usePersonalityQuery,
} from "@/api/domains/attribute/queries";
import { catKeys, useCatByIdQuery } from "@/api/domains/cat/queries";
import { postKeys, useCatPostsQuery } from "@/api/domains/post/queries";
import MoreIcon from "@/assets/icons/more.svg";
import { CatProfileHeader } from "@/components/cat/profile-header";
import IconButton from "@/components/common/icon-button";
import { RefreshableScrollView } from "@/components/common/logo-refresh-control";
import { SuspenseWithDelay } from "@/components/ui/suspense-with-delay";
import { ProfileHeaderSkeleton } from "@/components/user/profile/profile-header";
import PostGrid, {
  PostGridSkeleton,
} from "@/components/post/grid";
import { useColors } from "@/hooks/use-colors";
import { useLoadMoreScroll } from "@/hooks/use-load-more-scroll";
import { useRefreshQueries } from "@/hooks/use-refresh-queries";
import { formatDate } from "@/lib/utils";
import { Stack, useLocalSearchParams } from "expo-router";
import { View } from "react-native";

// ─── Profile header ───────────────────────────────────────────

const CatDetailProfileHeader = ({ catId }: { catId: string }) => {
  const { data: cat } = useCatByIdQuery(catId);
  const { data: appearances } = useAppearanceQuery();
  const { data: personalities } = usePersonalityQuery();
  const { colors } = useColors();

  const tags = [
    ...personalities
      .filter((p) => cat.personalities.includes(p.id))
      .map((p) => p.label),
    ...appearances
      .filter((a) => cat.appearances.includes(a.id))
      .map((a) => a.label),
  ];

  const infoParts = [formatDate(cat.birthDate), cat.breed].filter(
    Boolean,
  ) as string[];

  return (
    <>
      <Stack.Screen
        options={{
          title: `${cat.name}의 프로필`,
          headerRight: () => (
            <IconButton className="p-3 active:opacity-60">
              <MoreIcon width={24} height={24} color={colors.icon.primary} />
            </IconButton>
          ),
        }}
      />
      <CatProfileHeader
        imageUrl={cat.profileImageUrl}
        name={cat.name}
        subtitle={infoParts.length > 0 ? infoParts.join(" · ") : null}
        gender={cat.gender}
        tags={tags}
      />
    </>
  );
};

// ─── Post grid ────────────────────────────────────────────────

interface CatDetailPostGridProps {
  catId: string;
  loadMoreRef: React.RefObject<(() => void) | null>;
}

const CatDetailPostGrid = ({ catId, loadMoreRef }: CatDetailPostGridProps) => {
  const {
    data: postsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCatPostsQuery(catId);
  const posts = postsData.pages.flat();

  loadMoreRef.current = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <PostGrid
      posts={posts}
      isFetchingNextPage={isFetchingNextPage}
      emptyMessage="아직 작성한 게시글이 없어요"
    />
  );
};

// ─── Page ─────────────────────────────────────────────────────

const CatDetailPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { handleScroll, loadMoreRef } = useLoadMoreScroll();
  const refreshQueries = useRefreshQueries([
    catKeys.detail(id),
    postKeys.catPosts(id),
  ]);

  return (
    <View className="flex-1 bg-semantic-bg-primary">
      <RefreshableScrollView
        onRefresh={refreshQueries}
        onScroll={handleScroll}
        scrollEventThrottle={100}
      >
        <SuspenseWithDelay fallback={<ProfileHeaderSkeleton />}>
          <CatDetailProfileHeader catId={id} />
        </SuspenseWithDelay>
        <SuspenseWithDelay fallback={<PostGridSkeleton />}>
          <CatDetailPostGrid catId={id} loadMoreRef={loadMoreRef} />
        </SuspenseWithDelay>
      </RefreshableScrollView>
    </View>
  );
};

export default CatDetailPage;
