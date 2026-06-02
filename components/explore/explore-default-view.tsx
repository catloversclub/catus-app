import { postKeys, useDailyPopularPostsQuery } from "@/api/domains/post/queries";
import { Post } from "@/api/domains/post/types";
import { RefreshableScrollView } from "@/components/common/logo-refresh-control";
import { Skeleton } from "@/components/ui/skeleton";
import { useRefreshQueries } from "@/hooks/use-refresh-queries";
import { getMediaUrl } from "@/lib/utils";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Suspense } from "react";
import {
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

const DailyPopularSkeleton = () => {
  const { width } = useWindowDimensions();
  const size = Math.floor((width - 24 - 4) / 3);

  return (
    <View style={{ gap: 2 }}>
      {[0, 1, 2].map((row) => (
        <View key={row} style={{ flexDirection: "row", gap: 2 }}>
          {[0, 1, 2].map((col) => (
            <Skeleton
              key={col}
              className="rounded-none"
              style={{ width: size, height: size }}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const PostGridItem = ({ post }: { post: Post }) => {
  const { width } = useWindowDimensions();
  const size = (width - 24 - 4) / 3;
  const imageUrl = post.images[0]?.url;

  return (
    <Link href={`/post/${post.id}`} asChild>
      <Pressable style={{ width: size, height: size }}>
        {imageUrl ? (
          <Image
            source={{ uri: getMediaUrl(imageUrl) }}
            style={{ width: size, height: size }}
            contentFit="cover"
          />
        ) : (
          <View
            style={{ width: size, height: size }}
            className="bg-semantic-bg-secondary"
          />
        )}
      </Pressable>
    </Link>
  );
}

const DailyPopularGrid = () => {
  const { data: posts } = useDailyPopularPostsQuery();

  if (!posts || posts.length === 0) return null;

  const rows: Post[][] = [];
  for (let i = 0; i < posts.length; i += 3) {
    rows.push(posts.slice(i, i + 3));
  }

  return (
    <View style={{ gap: 2 }}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={{ flexDirection: "row", gap: 2 }}>
          {row.map((post) => (
            <PostGridItem key={post.id} post={post} />
          ))}
        </View>
      ))}
    </View>
  );
}

const ExploreDefaultView = () => {
  const refreshQueries = useRefreshQueries([postKeys.dailyPopular()]);
  return (
    <RefreshableScrollView
      onRefresh={refreshQueries}
      className="flex-1"
      contentContainerClassName="gap-6 pb-6"
    >
      <View className="px-3 pt-6 gap-6">
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
          오늘의 인기 게시물
        </Text>
        <View className="px-3">
          <Suspense fallback={<DailyPopularSkeleton />}>
            <DailyPopularGrid />
          </Suspense>
        </View>
      </View>
    </RefreshableScrollView>
  );
};

export default ExploreDefaultView;
