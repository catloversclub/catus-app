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
import { ProfileHeaderSkeleton } from "@/components/user/profile/profile-header";
import ProfilePostGrid, {
  PostGridSkeleton,
} from "@/components/user/profile/profile-post-grid";
import { useColors } from "@/hooks/use-colors";
import { useLoadMoreScroll } from "@/hooks/use-load-more-scroll";
import { useRefreshQueries } from "@/hooks/use-refresh-queries";
import { formatDate } from "@/lib/utils";
import { Stack, useLocalSearchParams } from "expo-router";
import { Suspense } from "react";
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

const CatDetailPostGrid = ({
  catId,
  loadMoreRef,
}: {
  catId: string;
  loadMoreRef: React.RefObject<(() => void) | null>;
}) => {
  const {
    data: postsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCatPostsQuery(catId);
  const posts = postsData.pages.flat();

  return (
    <ProfilePostGrid
      posts={posts}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
      emptyMessage="아직 작성한 게시글이 없어요"
      loadMoreRef={loadMoreRef}
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
        <Suspense fallback={<ProfileHeaderSkeleton />}>
          <CatDetailProfileHeader catId={id} />
        </Suspense>
        <Suspense fallback={<PostGridSkeleton />}>
          <CatDetailPostGrid catId={id} loadMoreRef={loadMoreRef} />
        </Suspense>
      </RefreshableScrollView>
    </View>
  );
};

export default CatDetailPage;
