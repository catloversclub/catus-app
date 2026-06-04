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
import ZoomableImage from "@/components/common/zoomable-image";
import { CAROUSEL_CONFIG } from "@/constants/config";
import { Skeleton } from "@/components/ui/skeleton";
import { CarouselCounter, CarouselDots } from "./carousel-indicator";

interface PostCarouselProps {
  post: Post;
  overlay?: React.ReactNode;
  linkable?: boolean;
}

interface CarouselItemProps {
  item: PostImage;
  index: number;
  catName: string;
  carouselWidth: number;
  imageHeight: number;
  linkable: boolean;
  postId: string;
}

const CarouselItem = ({
  item,
  index,
  catName,
  carouselWidth,
  imageHeight,
  linkable,
  postId,
}: CarouselItemProps) => {
  const img = (
    <ZoomableImage
      source={{ uri: item.url }}
      alt={`${catName} photo ${index + 1}`}
      style={{ width: carouselWidth, height: imageHeight }}
    />
  );

  return linkable ? (
    <Pressable onPress={() => router.push(`/post/${postId}`)}>
      {img}
    </Pressable>
  ) : (
    img
  );
};

const PostCarousel = ({
  post,
  overlay,
  linkable = true,
}: PostCarouselProps) => {
  const [current, setCurrent] = useState(0);
  const [imageHeight, setImageHeight] = useState<number | null>(null);
  const { width } = useWindowDimensions();
  const carouselWidth = width - 24;

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken<PostImage>[] }) => {
      if (viewableItems.length > 0) {
        setCurrent(viewableItems[0].index ?? 0);
      }
    },
    [],
  );

  const catName = post.cat?.name ?? post.author.nickname;

  if (imageHeight === null) {
    return (
      <>
        {post.images[0] && (
          <View style={{ height: 0, overflow: "hidden" }}>
            <Image
              source={{ uri: post.images[0].url }}
              style={{ width: carouselWidth, height: carouselWidth }}
              onLoad={(e) => {
                const { width: w, height: h } = e.source;
                if (w > 0) setImageHeight(carouselWidth * (h / w));
              }}
            />
          </View>
        )}
        <Skeleton style={{ width: carouselWidth, height: carouselWidth, borderRadius: 6 }} />
      </>
    );
  }

  return (
    <>
      <View style={{ overflow: "hidden", borderRadius: 6 }}>
        <FlatList
          data={post.images}
          keyExtractor={(image) => image.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={CAROUSEL_CONFIG}
          renderItem={({ item, index }) => (
            <CarouselItem
              item={item}
              index={index}
              catName={catName}
              carouselWidth={carouselWidth}
              imageHeight={imageHeight}
              linkable={linkable}
              postId={post.id}
            />
          )}
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
