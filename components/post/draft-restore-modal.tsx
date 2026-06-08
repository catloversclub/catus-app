import Button from "@/components/common/button";
import CenterModal from "@/components/modal/center-modal";
import { Text, View } from "react-native";

interface DraftRestoreModalProps {
  visible: boolean;
  onCancel: () => void;
  onRestore: () => void;
}

const DraftRestoreModal = ({
  visible,
  onCancel,
  onRestore,
}: DraftRestoreModalProps) => {
  return (
    <CenterModal visible={visible} onClose={onCancel}>
      <View className="gap-5 rounded-md bg-semantic-bg-primary px-4 pb-4 pt-6">
        <View className="gap-3">
          <View className="h-6 w-6 rounded-sm border-2 border-dashed border-semantic-icon-secondary" />
          <Text className="typo-body1 text-semantic-text-secondary">
            임시 저장된 글을 불러올까요?
          </Text>
        </View>
        <View className="flex-row gap-1.5">
          <View className="flex-1">
            <Button
              button={{
                label: "취소",
                onPress: onCancel,
                variant: "secondary",
                size: "lg",
              }}
            />
          </View>
          <View className="flex-1">
            <Button
              button={{
                label: "불러오기",
                onPress: onRestore,
                size: "lg",
              }}
            />
          </View>
        </View>
      </View>
    </CenterModal>
  );
};

export default DraftRestoreModal;
