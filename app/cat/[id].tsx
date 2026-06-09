import {
  useAppearanceQuery,
  usePersonalityQuery,
} from "@/api/domains/attribute/queries";
import { catKeys, useCatByIdQuery } from "@/api/domains/cat/queries";
import { postKeys, useCatPostsQuery } from "@/api/domains/post/queries";
import { userKeys } from "@/api/domains/user/queries";
import MoreIcon from "@/assets/icons/more.svg";
import CatButlerCard from "@/components/cat/butler-card";
import { CatProfileHeader } from "@/components/cat/profile-header";
import IconButton from "@/components/common/icon-button";
import { useLogoRefreshControl } from "@/components/common/logo-refresh-control";
import PostGrid, { PostGridSkeleton } from "@/components/post/grid";
import { SuspenseWithDelay } from "@/components/ui/suspense-with-delay";
import { ProfileHeaderSkeleton } from "@/components/user/profile/profile-header";
import { useColors } from "@/hooks/use-colors";
import { useRefreshQueries } from "@/hooks/use-refresh-queries";
import { formatDate } from "@/lib/utils";
import { Stack, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

interface CatDetailGridProps {
  catId: string;
}

const CatDetailGrid = ({ catId }: CatDetailGridProps) => {
  const { data: cat } = useCatByIdQuery(catId);
  const { data: appearances } = useAppearanceQuery();
  const { data: personalities } = usePersonalityQuery();
  const { colors } = useColors();
  const {
    data: postsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCatPostsQuery(catId);

  const posts = postsData.pages.flat();

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

  const refreshQueries = useRefreshQueries([
    catKeys.detail(catId),
    userKeys.detail(cat.butlerId),
    postKeys.catPosts(catId),
  ]);
  const { refreshControl } = useLogoRefreshControl({
    onRefresh: refreshQueries,
  });

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
      <PostGrid
        posts={posts}
        isFetchingNextPage={isFetchingNextPage}
        emptyComponent={
          <View className="py-12 items-center justify-center">
            <Text className="typo-body1 text-semantic-text-tertiary">
              아직 작성한 게시글이 없어요
            </Text>
          </View>
        }
        ListHeaderComponent={
          <>
            <CatProfileHeader
              imageUrl={cat.profileImageUrl}
              name={cat.name}
              subtitle={infoParts.length > 0 ? infoParts.join(" · ") : null}
              gender={cat.gender}
              tags={tags}
            />
            <CatButlerCard userId={cat.butlerId} />
          </>
        }
        scrollEnabled
        refreshControl={refreshControl}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
      />
    </>
  );
};

const CatDetailPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View className="flex-1 bg-semantic-bg-primary">
      <SuspenseWithDelay
        fallback={
          <>
            <ProfileHeaderSkeleton />
            <PostGridSkeleton />
          </>
        }
      >
        <CatDetailGrid catId={id} />
      </SuspenseWithDelay>
    </View>
  );
};

export default CatDetailPage;
