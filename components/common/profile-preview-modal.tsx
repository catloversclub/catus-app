import AvatarDark from "@/assets/images/avatar/user-dark.png";
import AvatarLight from "@/assets/images/avatar/user-light.png";
import { useColors } from "@/hooks/use-colors";
import { Image } from "expo-image";
import { Modal, Pressable } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const PREVIEW_SIZE = 200;

interface ProfilePreviewModalProps {
  visible: boolean;
  imageUrl: string | null;
  onClose: () => void;
}

const ProfilePreviewModal = ({
  visible,
  imageUrl,
  onClose,
}: ProfilePreviewModalProps) => {
  const { scheme } = useColors();
  const defaultAvatar = scheme === "dark" ? AvatarDark : AvatarLight;

  const scale = useSharedValue(1);
  const baseScale = useSharedValue(1);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = baseScale.value * e.scale;
    })
    .onEnd(() => {
      baseScale.value = 1;
      scale.value = withSpring(1, { damping: 15, stiffness: 200 });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

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
              source={imageUrl ? { uri: imageUrl } : defaultAvatar}
              placeholder={defaultAvatar}
              transition={150}
              style={{
                width: PREVIEW_SIZE,
                height: PREVIEW_SIZE,
                borderRadius: PREVIEW_SIZE,
              }}
              contentFit="cover"
              alt="profile"
            />
          </Animated.View>
        </GestureDetector>
      </Pressable>
    </Modal>
  );
};

export default ProfilePreviewModal;
