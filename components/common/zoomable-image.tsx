import { Portal } from "@rn-primitives/portal";
import { Image, ImageSource } from "expo-image";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  interpolate,
  measure,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface ZoomableImageProps {
  source: ImageSource;
  style?: object;
  contentFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  alt?: string;
}

const ZoomableImage = ({
  source,
  style,
  contentFit = "cover",
  alt,
}: ZoomableImageProps) => {
  const animatedRef = useAnimatedRef<Animated.View>();
  const scale = useSharedValue(1);
  const baseScale = useSharedValue(1);
  const overlayLeft = useSharedValue(0);
  const overlayTop = useSharedValue(0);
  const overlayWidth = useSharedValue(0);
  const overlayHeight = useSharedValue(0);

  const pinchGesture = Gesture.Pinch()
    .onBegin(() => {
      const m = measure(animatedRef);
      if (m) {
        overlayLeft.value = m.pageX;
        overlayTop.value = m.pageY;
        overlayWidth.value = m.width;
        overlayHeight.value = m.height;
      }
    })
    .onUpdate((e) => {
      scale.value = baseScale.value * e.scale;
    })
    .onEnd(() => {
      baseScale.value = 1;
      scale.value = withTiming(1, {
        duration: 200,
        easing: Easing.out(Easing.quad),
      });
    });

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scale.value, [1, 2], [0, 0.75], "clamp"),
  }));

  const overlayImageStyle = useAnimatedStyle(() => ({
    position: "absolute",
    left: overlayLeft.value,
    top: overlayTop.value,
    width: overlayWidth.value,
    height: overlayHeight.value,
    opacity: interpolate(scale.value, [1.0, 1.05], [0, 1], "clamp"),
    transform: [{ scale: scale.value }],
  }));

  const originalImageStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scale.value, [1.0, 1.05], [1, 0], "clamp"),
  }));

  return (
    <>
      <GestureDetector gesture={pinchGesture}>
        <Animated.View ref={animatedRef} style={originalImageStyle}>
          <Image
            source={source}
            style={style}
            contentFit={contentFit}
            alt={alt}
          />
        </Animated.View>
      </GestureDetector>

      <Portal>
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: "black" },
              backdropStyle,
            ]}
          />
          <Animated.View style={overlayImageStyle}>
            <Image
              source={source}
              style={{ width: "100%", height: "100%" }}
              contentFit={contentFit}
              alt={alt}
            />
          </Animated.View>
        </View>
      </Portal>
    </>
  );
};

export default ZoomableImage;
