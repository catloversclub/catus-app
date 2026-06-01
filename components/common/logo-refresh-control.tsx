import { useColors } from "@/hooks/use-colors";
import { Image } from "expo-image";
import { useCallback, useEffect, useState } from "react";
import { RefreshControl, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

type Options = {
  onRefresh: () => Promise<unknown> | void;
};

const useLogoRefreshControl = ({ onRefresh }: Options) => {
  const [refreshing, setRefreshing] = useState(false);
  const { scheme } = useColors();
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (refreshing) {
      rotation.value = 0;
      rotation.value = withRepeat(
        withTiming(360, { duration: 800, easing: Easing.linear }),
        -1,
        false,
      );
    } else {
      cancelAnimation(rotation);
      rotation.value = 0;
    }
  }, [refreshing, rotation]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const refreshControl = (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={handleRefresh}
      tintColor="transparent"
      colors={["transparent"]}
    />
  );

  const logoOverlay = (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        top: 8,
        left: 0,
        right: 0,
        alignItems: "center",
        zIndex: 100,
        opacity: refreshing ? 1 : 0,
      }}
    >
      <Animated.View style={animatedStyle}>
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
    </View>
  );

  return { refreshControl, logoOverlay, refreshing };
};

export { useLogoRefreshControl };
