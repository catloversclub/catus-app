import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  ImageSourcePropType,
  ListRenderItem,
  View,
  ViewToken,
} from "react-native";

const AUTO_PLAY_INTERVAL = 5000;

interface CarouselProps {
  images: ImageSourcePropType[];
  renderItem: ListRenderItem<ImageSourcePropType> | null | undefined;
  autoPlay?: boolean;
}

const Carousel = ({ images, renderItem, autoPlay }: CarouselProps) => {
  const [current, setCurrent] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      const next = (current + 1) % images.length;
      flatListRef.current?.scrollToIndex({ index: next, animated: true });
      setCurrent(next);
    }, AUTO_PLAY_INTERVAL);

    return () => clearInterval(interval);
  }, [autoPlay, current, images.length]);

  const onViewableItemsChanged = useRef(
    ({
      viewableItems,
    }: {
      viewableItems: ViewToken<ImageSourcePropType>[];
    }) => {
      if (viewableItems.length > 0) {
        setCurrent(viewableItems[0].index ?? 0);
      }
    },
  ).current;

  return (
    <View className="flex-col items-center gap-3">
      <FlatList
        ref={flatListRef}
        data={images}
        keyExtractor={(_, index) => String(index)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        renderItem={renderItem}
        style={{ flexGrow: 0 }}
      />
      <View className="flex-row justify-center gap-1.5">
        {images.map((_, index) => (
          <View
            key={index}
            className={`size-1.5 rounded-full ${
              index === current
                ? "bg-semantic-icon-accent"
                : "bg-semantic-icon-minor"
            }`}
          />
        ))}
      </View>
    </View>
  );
};

export default Carousel;
