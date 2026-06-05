import { Image, ImageSource } from "expo-image";
import { useEffect } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const CIRCULAR_SIZE = 200;

interface Origin {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageViewerModalProps {
  visible: boolean;
  source: ImageSource;
  onClose: () => void;
  circular?: boolean;
  origin?: Origin;
}

const ImageViewerModal = ({
  visible,
  source,
  onClose,
  circular = false,
  origin,
}: ImageViewerModalProps) => {
  const { width, height } = useWindowDimensions();

  const scaleAnim = useSharedValue(1);
  const txAnim = useSharedValue(0);
  const tyAnim = useSharedValue(0);
  const bgOpacity = useSharedValue(0);
  const pinchScale = useSharedValue(1);
  const pinchBase = useSharedValue(1);

  useEffect(() => {
    if (!visible) return;

    pinchScale.value = 1;
    pinchBase.value = 1;

    if (origin) {
      const targetSize = circular ? CIRCULAR_SIZE : width;
      scaleAnim.value = origin.width / targetSize;
      txAnim.value = origin.x + origin.width / 2 - width / 2;
      tyAnim.value = origin.y + origin.height / 2 - height / 2;
      bgOpacity.value = 0;

      const cfg = { duration: 300, easing: Easing.out(Easing.quad) };
      scaleAnim.value = withTiming(1, cfg);
      txAnim.value = withTiming(0, cfg);
      tyAnim.value = withTiming(0, cfg);
      bgOpacity.value = withTiming(1, cfg);
    } else {
      scaleAnim.value = 1;
      txAnim.value = 0;
      tyAnim.value = 0;
      bgOpacity.value = 1;
    }
  }, [
    bgOpacity,
    circular,
    height,
    origin,
    pinchBase,
    pinchScale,
    scaleAnim,
    txAnim,
    tyAnim,
    visible,
    width,
  ]);

  const handleClose = () => {
    const cfg = { duration: 220, easing: Easing.in(Easing.quad) };

    if (origin) {
      const targetSize = circular ? CIRCULAR_SIZE : width;
      scaleAnim.value = withTiming(origin.width / targetSize, cfg);
      txAnim.value = withTiming(origin.x + origin.width / 2 - width / 2, cfg);
      tyAnim.value = withTiming(origin.y + origin.height / 2 - height / 2, cfg);
    }

    bgOpacity.value = withTiming(0, cfg, (finished) => {
      if (finished) runOnJS(onClose)();
    });
  };

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      pinchScale.value = pinchBase.value * e.scale;
    })
    .onEnd(() => {
      pinchBase.value = 1;
      pinchScale.value = withTiming(1, {
        duration: 200,
        easing: Easing.out(Easing.quad),
      });
    });

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: bgOpacity.value,
  }));

  const imageContainerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: txAnim.value },
      { translateY: tyAnim.value },
      { scale: scaleAnim.value * pinchScale.value },
    ],
  }));

  const imageStyle = circular
    ? {
        width: CIRCULAR_SIZE,
        height: CIRCULAR_SIZE,
        borderRadius: CIRCULAR_SIZE,
      }
    : { width, height };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <Animated.View
        style={[StyleSheet.absoluteFill, styles.backdrop, backdropStyle]}
        pointerEvents="none"
      />
      <Pressable
        style={[StyleSheet.absoluteFill, styles.center]}
        onPress={handleClose}
      >
        <GestureDetector gesture={pinchGesture}>
          <Animated.View style={imageContainerStyle}>
            <Image
              source={source}
              style={imageStyle}
              contentFit={circular ? "cover" : "contain"}
              alt="preview"
            />
          </Animated.View>
        </GestureDetector>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "rgba(0,0,0,0.75)",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ImageViewerModal;
