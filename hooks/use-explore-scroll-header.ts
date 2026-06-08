import { useCallback } from "react";
import {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const SCROLL_THRESHOLD = 4;
const SEARCH_INPUT_HEIGHT = 58;

export const useExploreScrollHeader = () => {
  const lastScrollY = useSharedValue(0);
  const headerProgress = useSharedValue(1);
  const targetVisible = useSharedValue(1);

  const resetToVisible = useCallback(() => {
    lastScrollY.value = 0;
    targetVisible.value = 1;
    headerProgress.value = withTiming(1, { duration: 200 });
  }, [lastScrollY, targetVisible, headerProgress]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const y = event.contentOffset.y;
      const maxY = event.contentSize.height - event.layoutMeasurement.height;
      const diff = y - lastScrollY.value;

      if (maxY <= 0) {
        lastScrollY.value = 0;
        if (targetVisible.value !== 1) {
          targetVisible.value = 1;
          headerProgress.value = withTiming(1, { duration: 200 });
        }
        return;
      }

      if (y <= 0) {
        lastScrollY.value = 0;
        if (targetVisible.value !== 1) {
          targetVisible.value = 1;
          headerProgress.value = withTiming(1, { duration: 200 });
        }
        return;
      }

      if (maxY > 0 && y > maxY) return;

      lastScrollY.value = y;

      if (diff > SCROLL_THRESHOLD && targetVisible.value !== 0) {
        targetVisible.value = 0;
        headerProgress.value = withTiming(0, { duration: 200 });
      } else if (diff < -SCROLL_THRESHOLD && targetVisible.value !== 1) {
        targetVisible.value = 1;
        headerProgress.value = withTiming(1, { duration: 200 });
      }
    },
  });

  const searchInputStyle = useAnimatedStyle(() => ({
    height: headerProgress.value * SEARCH_INPUT_HEIGHT,
    opacity: headerProgress.value,
    overflow: "hidden",
  }));

  return { scrollHandler, searchInputStyle, resetToVisible };
};
