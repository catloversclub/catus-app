import { useRef } from "react";
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";

const useLoadMoreScroll = (threshold = 200) => {
  const loadMoreRef = useRef<(() => void) | null>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    if (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - threshold
    ) {
      loadMoreRef.current?.();
    }
  };

  return { handleScroll, loadMoreRef };
};

export { useLoadMoreScroll };
