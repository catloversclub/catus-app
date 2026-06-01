import {
  useAppearanceQuery,
  usePersonalityQuery,
} from "@/api/domains/attribute/queries";
import { useCatByIdQuery } from "@/api/domains/cat/queries";
import { Gender } from "@/api/domains/cat/types";
import { useCatPostsQuery } from "@/api/domains/post/queries";
import MoreIcon from "@/assets/icons/more.svg";
import IconButton from "@/components/common/icon-button";
import ProfileHeader from "@/components/user/profile-header";
import ProfilePostGrid, {
  PostGridSkeleton,
} from "@/components/user/profile-post-grid";
import { useColors } from "@/hooks/use-colors";
import { Stack, useLocalSearchParams } from "expo-router";
import { Suspense } from "react";
import { View } from "react-native";

const GENDER_LABEL: Record<Gender, string | null> = {
  FEMALE: "암컷",
  MALE: "수컷",
  UNKNOWN: null,
};

// ─── Profile header ───────────────────────────────────────────

const CatProfileHeader = ({ catId }: { catId: string }) => {
  const { data: cat } = useCatByIdQuery(catId);
  const { data: appearances } = useAppearanceQuery();
  const { data: personalities } = usePersonalityQuery();

  const tags = [
    ...personalities
      .filter((p) => cat.personalities.includes(p.id))
      .map((p) => p.label),
    ...appearances
      .filter((a) => cat.appearances.includes(a.id))
      .map((a) => a.label),
  ];

  const infoParts = [
    cat.birthDate,
    cat.gender ? GENDER_LABEL[cat.gender] : null,
    cat.breed,
  ].filter(Boolean) as string[];

  return (
    <ProfileHeader
      imageUrl={cat.profileImageUrl}
      name={cat.name}
      subtitle={infoParts.length > 0 ? infoParts.join(" · ") : null}
      tags={tags}
    />
  );
};

// ─── Page content ─────────────────────────────────────────────

const CatDetailContent = ({ catId }: { catId: string }) => {
  const { data: cat } = useCatByIdQuery(catId);
  const { colors } = useColors();
  const {
    data: postsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCatPostsQuery(catId);
  const posts = postsData.pages.flat();

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
      <ProfilePostGrid
        ListHeaderComponent={() => <CatProfileHeader catId={catId} />}
        posts={posts}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        emptyMessage="아직 작성한 게시글이 없어요"
      />
    </>
  );
};

// ─── Page ─────────────────────────────────────────────────────

const CatDetailPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View className="flex-1 bg-semantic-bg-primary">
      <Suspense fallback={<PostGridSkeleton />}>
        <CatDetailContent catId={id} />
      </Suspense>
    </View>
  );
};

export default CatDetailPage;
