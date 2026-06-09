import ArrowLeftIcon from "@/assets/icons/arrow-left.svg";
import ActionPressable from "@/components/common/action-pressable";
import ImagePickerScreen from "@/components/media/image-picker-screen";
import { useColors } from "@/hooks/use-colors";
import { Portal } from "@rn-primitives/portal";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ImagePickerModalProps {
  visible: boolean;
  selectionLimit: number;
  confirmLabel: string;
  title?: string;
  onConfirm: (uris: string[]) => void;
  onClose: () => void;
}

const ImagePickerModal = ({
  visible,
  selectionLimit,
  confirmLabel,
  title = "최근 항목",
  onConfirm,
  onClose,
}: ImagePickerModalProps) => {
  const { colors } = useColors();
  const { top } = useSafeAreaInsets();

  if (!visible) return null;

  return (
    <Portal name="image-picker-modal">
      <View
        className="absolute inset-0 z-50 bg-semantic-bg-primary"
        style={{ paddingTop: top }}
      >
        <View className="h-14 flex-row items-center justify-center border-b border-semantic-border-primary px-3">
          <ActionPressable
            onPress={onClose}
            className="absolute left-3 p-2"
          >
            <ArrowLeftIcon width={20} height={20} color={colors.icon.primary} />
          </ActionPressable>
          <Text className="typo-title3 text-semantic-text-primary">
            {title}
          </Text>
        </View>
        <ImagePickerScreen
          selectionLimit={selectionLimit}
          confirmLabel={confirmLabel}
          onConfirm={onConfirm}
          onCancel={onClose}
        />
      </View>
    </Portal>
  );
};

export default ImagePickerModal;
