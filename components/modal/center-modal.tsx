import { AnimatePresence, MotiView } from "moti";
import { useEffect, useRef, useState } from "react";
import { Modal, Pressable } from "react-native";

interface CenterModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const CenterModal = ({ visible, onClose, children }: CenterModalProps) => {
  const [isMounted, setIsMounted] = useState(visible);
  const visibleRef = useRef(visible);

  useEffect(() => {
    visibleRef.current = visible;

    if (visible) {
      setIsMounted(true);
    }
  }, [visible]);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      visible={isMounted}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <AnimatePresence
        onExitComplete={() => {
          if (!visibleRef.current) {
            setIsMounted(false);
          }
        }}
      >
        {visible ? (
          <MotiView
            key="center-modal"
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "timing", duration: 180 }}
            exitTransition={{ type: "timing", duration: 150 }}
            className="flex-1 bg-semantic-dimmed-primary justify-center items-center"
          >
            <Pressable className="absolute inset-0" onPress={onClose} />

            <MotiView
              from={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.96 }}
              transition={{ type: "timing", duration: 180 }}
              exitTransition={{ type: "timing", duration: 150 }}
              className="w-4/5"
            >
              {children}
            </MotiView>
          </MotiView>
        ) : null}
      </AnimatePresence>
    </Modal>
  );
};

export default CenterModal;
