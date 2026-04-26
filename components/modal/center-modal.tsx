import { useEffect, useRef } from "react";
import { Animated, Modal, Pressable } from "react-native";

interface CenterModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const CenterModal = ({ visible, onClose, children }: CenterModalProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="none">
      {/* 딤드 배경 */}
      <Animated.View
        style={{ opacity: fadeAnim }}
        className="flex-1 bg-semantic-dimmed-primary justify-center items-center"
      >
        <Pressable className="absolute inset-0" onPress={onClose} />

        {/* 모달 본체 */}
        <Animated.View
          style={{ transform: [{ scale: scaleAnim }] }}
          className="w-4/5"
        >
          {children}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default CenterModal;
