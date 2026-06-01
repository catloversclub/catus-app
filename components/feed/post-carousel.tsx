import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import {
  FlatList,
  Pressable,
  useWindowDimensions,
  View,
  ViewToken,
} from "react-native";

import { Post, PostImage } from "@/api/domains/post/types";
import { CAROUSEL_CONFIG } from "@/constants/config";
import { getMediaUrl } from "@/lib/utils";
import { CarouselCounter, CarouselDots } from "./carousel-indicator";

interface PostCarouselProps {
  post: Post;
  overlay?: React.ReactNode;
  linkable?: boolean;
}

const PostCarousel = ({
  post,
  overlay,
  linkable = true,
}: PostCarouselProps) => {
  const [current, setCurrent] = useState(0);
  const [aspectRatio, setAspectRatio] = useState(1);
  const { width } = useWindowDimensions();
  const carouselWidth = width - 24;
  const imageHeight = carouselWidth * aspectRatio;

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
                style={{ width: carouselWidth, height: imageHeight }}
                onLoad={index === 0 ? (e) => {
                  const { width: w, height: h } = e.source;
                  if (w > 0) setAspectRatio(h / w);
                } : undefined}
              />
            );
            return linkable ? (
              <Pressable onPress={() => router.push(`/post/${post.id}`)}>{img}</Pressable>
            ) : (
              img
            );
          }}
        />

        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.6)"]}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 80,
          }}
          pointerEvents="none"
        />

        {post.images.length > 1 && (
          <CarouselCounter current={current} total={post.images.length} />
        )}

        {overlay}
      </View>

      {post.images.length > 1 && (
        <CarouselDots count={post.images.length} current={current} />
      )}
    </>
  );
};

export default PostCarousel;
