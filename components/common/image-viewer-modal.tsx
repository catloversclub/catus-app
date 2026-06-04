import { Image, ImageSource } from "expo-image";
import { useEffect } from "react";
import { Modal, Pressable, useWindowDimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const CIRCULAR_SIZE = 200;

interface ImageViewerModalProps {
  visible: boolean;
  source: ImageSource;
  onClose: () => void;
  circular?: boolean;
}

const ImageViewerModal = ({
  visible,
  source,
  onClose,
  circular = false,
}: ImageViewerModalProps) => {
  const { width, height } = useWindowDimensions();
  const scale = useSharedValue(1);
  const baseScale = useSharedValue(1);

  useEffect(() => {
    if (visible) {
      scale.value = 1;
      baseScale.value = 1;
    }
  }, [visible]);

  const pinchGesture = Gesture.Pinch()
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

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const imageStyle = circular
    ? { width: CIRCULAR_SIZE, height: CIRCULAR_SIZE, borderRadius: CIRCULAR_SIZE }
    : { width, height };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.75)",
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={onClose}
      >
        <GestureDetector gesture={pinchGesture}>
          <Animated.View style={animatedStyle}>
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

export default ImageViewerModal;
