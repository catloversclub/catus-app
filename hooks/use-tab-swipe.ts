import { useRef, useState } from "react";
import { useWindowDimensions } from "react-native";
import { Gesture } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const SWIPE_THRESHOLD = 50;

interface UseTabSwipeOptions {
  tabCount: number;
  activeTab: number;
  onTabChange: (index: number) => void;
}

const useTabSwipe = ({ tabCount, activeTab, onTabChange }: UseTabSwipeOptions) => {
  const { width } = useWindowDimensions();
  const [renderTab, setRenderTab] = useState(activeTab);
  const translateX = useSharedValue(0);
  const isAnimating = useSharedValue(false);
  const renderTabRef = useRef(renderTab);
  const activeTabRef = useRef(activeTab);

  renderTabRef.current = renderTab;
  activeTabRef.current = activeTab;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const switchTab = (newTab: number) => {
    if (newTab === renderTabRef.current) return;
    if (newTab < 0 || newTab >= tabCount) return;
    const direction = newTab > renderTabRef.current ? 1 : -1;
    onTabChange(newTab);

    isAnimating.value = true;
    translateX.value = withTiming(-direction * width, { duration: 200 }, (finished) => {
      if (!finished) {
        isAnimating.value = false;
        return;
      }
      runOnJS(setRenderTab)(newTab);
      translateX.value = direction * width;
      translateX.value = withTiming(0, { duration: 200 }, () => {
        isAnimating.value = false;
      });
    });
  };

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-15, 15])
    .onEnd((e) => {
      if (isAnimating.value) return;
      if (Math.abs(e.translationX) < SWIPE_THRESHOLD) return;
      const currentTab = activeTabRef.current;
      if (e.translationX < 0 && currentTab < tabCount - 1) {
        runOnJS(switchTab)(currentTab + 1);
      } else if (e.translationX > 0 && currentTab > 0) {
        runOnJS(switchTab)(currentTab - 1);
      }
    });

  return { renderTab, animatedStyle, panGesture, switchTab };
};

export { useTabSwipe };
