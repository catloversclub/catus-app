import { Image } from "expo-image";
import { Link } from "expo-router";
import { useCallback, useState } from "react";
import {
  FlatList,
  Pressable,
  Text,
  useWindowDimensions,
  View,
  ViewToken,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { Post, PostImage } from "@/api/domains/post/types";
import { CAROUSEL_CONFIG } from "@/constants/config";
import { getMediaUrl } from "@/lib/utils";

interface PostCarouselProps {
  post: Post;
  overlay?: React.ReactNode;
  linkable?: boolean;
}

const PostCarousel = ({ post, overlay, linkable = true }: PostCarouselProps) => {
  const [current, setCurrent] = useState(0);
  const { width } = useWindowDimensions();
  const carouselWidth = width - 32;

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken<PostImage>[] }) => {
      if (viewableItems.length > 0) {
        setCurrent(viewableItems[0].index ?? 0);
      }
    },
    [],
  );

  const catName = post.cat?.name ?? post.author.nickname;

  return (
    <>
      <View className="relative overflow-hidden rounded-md">
        <FlatList
          data={post.images}
          keyExtractor={(image) => image.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={CAROUSEL_CONFIG}
          renderItem={({ item, index }) => {
            const img = (
              <Image
                source={getMediaUrl(item.url)}
                alt={`${catName} photo ${index + 1}`}
                style={{ width: carouselWidth, height: carouselWidth }}
              />
            );
            return linkable ? (
              <Link href={`/post/${post.id}`} asChild>
                <Pressable>{img}</Pressable>
              </Link>
            ) : (
              img
            );
          }}
        />

        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.6)"]}
          style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80 }}
          pointerEvents="none"
        />

        {post.images.length > 1 && (
          <View
            className="absolute right-1.5 top-1.5 z-10 rounded bg-semantic-dimmed-primary px-2 py-1.5"
            pointerEvents="none"
          >
            <Text className="typo-label2 text-gray-0">
              {current + 1} / {post.images.length}
            </Text>
          </View>
        )}

        {overlay}
      </View>

      {post.images.length > 1 && (
        <View className="w-full flex-row justify-center gap-1.5">
          {post.images.map((_, index) => (
            <View
              key={index}
              className={`h-1.5 w-1.5 rounded-full ${
                index === current ? "bg-semantic-icon-accent" : "bg-semantic-icon-minor"
              }`}
            />
          ))}
        </View>
      )}
    </>
  );
};

export default PostCarousel;
