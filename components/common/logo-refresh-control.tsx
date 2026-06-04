import Gradient from "@/components/common/gradient";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useCallback, useEffect, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  ScrollViewProps,
} from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const THRESHOLD = 80;

type Options = {
  onRefresh: () => Promise<unknown> | void;
};

const useLogoRefreshControl = ({ onRefresh }: Options) => {
  const [refreshing, setRefreshing] = useState(false);
  const { scheme } = useColors();
  const rotation = useSharedValue(0);
  const overlayOpacity = useSharedValue(0);

  useEffect(() => {
    if (refreshing) {
      rotation.value = 0;
      rotation.value = withRepeat(
        withTiming(360, { duration: 800, easing: Easing.linear }),
        -1,
        false,
      );
      overlayOpacity.value = withTiming(1, { duration: 150 });
    } else {
      cancelAnimation(rotation);
      rotation.value = 0;
      overlayOpacity.value = withTiming(0, { duration: 150 });
    }
  }, [refreshing, rotation, overlayOpacity]);

  const triggerRefresh = useCallback(async () => {
    if (refreshing) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  }, [refreshing, onRefresh]);

  const onScrollEndDrag = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (event.nativeEvent.contentOffset.y < -THRESHOLD) {
        triggerRefresh();
      }
    },
    [triggerRefresh],
  );

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const logoOverlay = (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: "absolute",
          top: 8,
          left: 0,
          right: 0,
          alignItems: "center",
          zIndex: 100,
        },
        overlayStyle,
      ]}
    >
      <Animated.View style={spinStyle}>
        <Image
          source={
            scheme === "dark"
              ? require("@/assets/images/logo/ios-dark.png")
              : require("@/assets/images/logo/ios-light.png")
          }
          style={{ width: 36, height: 36 }}
          contentFit="contain"
        />
      </Animated.View>
    </Animated.View>
  );

  return { onScrollEndDrag, logoOverlay, refreshing };
};

// ─────────────────────────────────────────────────────────────────────────────

interface RefreshableScrollViewProps extends ScrollViewProps {
  onRefresh: () => Promise<unknown> | void;
}

const RefreshableScrollView = ({
  onRefresh,
  children,
  onScrollEndDrag: onScrollEndDragProp,
  ...props
}: RefreshableScrollViewProps) => {
  const { onScrollEndDrag, logoOverlay } = useLogoRefreshControl({ onRefresh });

  const handleScrollEndDrag = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      onScrollEndDrag(e);
      onScrollEndDragProp?.(e);
    },
    [onScrollEndDrag, onScrollEndDragProp],
  );

  return (
    <>
      {logoOverlay}
      <Gradient
        direction="vertical"
        width="100%"
        height={20}
        style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        onScrollEndDrag={handleScrollEndDrag}
        {...props}
      >
        {children}
      </ScrollView>
    </>
  );
};

export { RefreshableScrollView, useLogoRefreshControl };
