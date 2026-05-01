import { useRef, useState } from "react";
import {
  FlatList,
  ImageSourcePropType,
  ListRenderItem,
  View,
  ViewToken,
} from "react-native";

interface CarouselProps {
  images: ImageSourcePropType[];
  renderItem: ListRenderItem<ImageSourcePropType> | null | undefined;
}

const Carousel = ({ images, renderItem }: CarouselProps) => {
  const [current, setCurrent] = useState(0);

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
