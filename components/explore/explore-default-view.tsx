import {
  useAppearanceQuery,
  usePersonalityQuery,
} from "@/api/domains/attribute/queries";
import { useCatByIdQuery } from "@/api/domains/cat/queries";
import { useDailyPopularPostsQuery } from "@/api/domains/post/queries";
import { Post } from "@/api/domains/post/types";
import { Chip } from "@/components/common/chip";
import PostCarousel from "@/components/post/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { SuspenseWithDelay } from "@/components/ui/suspense-with-delay";
import { Pressable, Text, useWindowDimensions, View } from "react-native";

interface DailyPopularCarouselItemProps {
  post: Post;
  appearances: Map<number, string>;
  personalities: Map<number, string>;
}

const DailyPopularCatOverlay = ({
  name,
  tags,
}: {
  name: string;
  tags: string[];
}) => {
  const tagRows = [];
  for (let i = 0; i < tags.length; i += 2) {
    tagRows.push(tags.slice(i, i + 2));
  }

  return (
    <View
      className="absolute bottom-12 left-6 right-6 z-10 gap-3"
      pointerEvents="none"
    >
      <Text className="typo-title2 text-white" numberOfLines={1}>
        {name}
      </Text>
      {tagRows.length > 0 && (
        <View className="gap-2">
          {tagRows.map((row) => (
            <View key={row.join("-")} className="flex-row gap-2">
              {row.map((tag) => (
                <Chip key={tag} label={tag} translucent />
              ))}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const DailyPopularCarouselItemWithCat = ({
  post,
  catId,
  appearances,
  personalities,
}: DailyPopularCarouselItemProps & { catId: string }) => {
  const { data: cat } = useCatByIdQuery(catId);
  const tags = [
    ...cat.personalities
      .map((id) => personalities.get(id))
      .filter((tag): tag is string => !!tag),
    ...cat.appearances
      .map((id) => appearances.get(id))
      .filter((tag): tag is string => !!tag),
  ].slice(0, 4);

  return (
    <PostCarousel
      post={post}
      dotsPlacement="overlay-bottom"
      overlay={<DailyPopularCatOverlay name={cat.name} tags={tags} />}
    />
  );
};

const DailyPopularCarouselItem = ({
  post,
  appearances,
  personalities,
}: DailyPopularCarouselItemProps) => {
  const primaryCatId = post.cats[0]?.id;

  if (!primaryCatId) {
    return <PostCarousel post={post} dotsPlacement="overlay-bottom" />;
  }

  return (
    <DailyPopularCarouselItemWithCat
      post={post}
      catId={primaryCatId}
      appearances={appearances}
      personalities={personalities}
    />
  );
};

const DailyPopularCarouselList = () => {
  const { data: posts } = useDailyPopularPostsQuery();
  const { data: appearanceData } = useAppearanceQuery();
  const { data: personalityData } = usePersonalityQuery();

  if (!posts || posts.length === 0) return null;

  const appearances = new Map(appearanceData.map((item) => [item.id, item.label]));
  const personalities = new Map(
    personalityData.map((item) => [item.id, item.label]),
  );

  return (
    <View className="gap-5 px-3">
      {posts.map((post) => (
        <DailyPopularCarouselItem
          key={post.id}
          post={post}
          appearances={appearances}
          personalities={personalities}
        />
      ))}
    </View>
  );
};

const DailyPopularCarouselListSkeleton = () => {
  const { width } = useWindowDimensions();
  const imageSize = width - 24;

  return (
    <View className="gap-5 px-3">
      {[0, 1].map((item) => (
        <Skeleton
          key={item}
          style={{ width: imageSize, height: imageSize, borderRadius: 6 }}
        />
      ))}
    </View>
  );
};

const ExploreDefaultView = () => {
  return (
    <>
      <View className="px-3 gap-6">
        <Pressable className="px-3 py-4 rounded gap-0.5 border border-[#C2E9FF] bg-[#EBF8FF]">
          <Text className="typo-title3 text-semantic-text-primary">
            천하제일 내 고양이 자랑대회
          </Text>
          <Text className="typo-body4 text-semantic-text-secondary">
            우리 고양이를 더 널리 알려보세요!
          </Text>
        </Pressable>
      </View>

      <View className="gap-3">
        <Text className="typo-title3 text-semantic-text-primary px-3">
          인기쟁이 고양이들 🔥
        </Text>
        <SuspenseWithDelay fallback={<DailyPopularCarouselListSkeleton />}>
          <DailyPopularCarouselList />
        </SuspenseWithDelay>
      </View>
    </>
  );
};

export default ExploreDefaultView;
