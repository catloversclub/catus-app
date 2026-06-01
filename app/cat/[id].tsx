import {
  useAppearanceQuery,
  usePersonalityQuery,
} from "@/api/domains/attribute/queries";
import { useCatByIdQuery } from "@/api/domains/cat/queries";
import { Gender } from "@/api/domains/cat/types";
import { useCatPostsQuery } from "@/api/domains/post/queries";
import MoreIcon from "@/assets/icons/more.svg";
import IconButton from "@/components/common/icon-button";
import ProfileImage from "@/components/common/profile-image";
import ProfilePostGrid, {
  PostGridSkeleton,
} from "@/components/user/profile-post-grid";
import { useColors } from "@/hooks/use-colors";
import { Stack, useLocalSearchParams } from "expo-router";
import { Suspense } from "react";
import { Text, View } from "react-native";

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

  const appearanceLabels = appearances
    .filter((a) => cat.appearances.includes(a.id))
    .map((a) => a.label);

  const personalityLabels = personalities
    .filter((p) => cat.personalities.includes(p.id))
    .map((p) => p.label);

  const tags = [...personalityLabels, ...appearanceLabels];

  const infoParts = [
    cat.birthDate,
    cat.gender ? GENDER_LABEL[cat.gender] : null,
    cat.breed,
  ].filter(Boolean);

  return (
    <View className="pt-6">
      <View className="flex-col items-center">
        <ProfileImage imageUrl={cat.profileImageUrl} size="lg" />
        <Text className="typo-title3 mb-1 text-semantic-text-primary mt-3">
          {cat.name}
        </Text>
        {infoParts.length > 0 && (
          <Text className="typo-body4 text-semantic-text-tertiary mb-3">
            {infoParts.join(" · ")}
          </Text>
        )}
        {tags.length > 0 && (
          <View className="flex-row flex-wrap justify-center gap-1.5 px-5 mb-6">
            {tags.map((tag) => (
              <View
                key={tag}
                className="px-3 py-1 rounded-full bg-semantic-bg-secondary"
              >
                <Text className="typo-body4 text-semantic-text-secondary">
                  {tag}
                </Text>
              </View>
            ))}
          </View>
        )}
        {tags.length === 0 && <View className="mb-6" />}
      </View>
    </View>
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
          headerTintColor: colors.text.primary,
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
  const { colors } = useColors();

  return (
    <View className="flex-1 bg-semantic-bg-primary">
      <Stack.Screen
        options={{
          headerTintColor: colors.text.primary,
          headerStyle: { backgroundColor: colors.bg.primary },
        }}
      />
      <Suspense fallback={<PostGridSkeleton />}>
        <CatDetailContent catId={id} />
      </Suspense>
    </View>
  );
};

export default CatDetailPage;
