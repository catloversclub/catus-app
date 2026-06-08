import Button from "@/components/common/button";
import CenterModal from "@/components/modal/center-modal";
import { useComposeStore } from "@/store/post/compose-store";
import { useDraftStore } from "@/store/post/draft-store";
import { router } from "expo-router";
import { Text, View } from "react-native";

interface DraftModalProps {
  visible: boolean;
  onClose: () => void;
  images: string[];
}

const DraftModal = ({ visible, onClose, images }: DraftModalProps) => {
  const { saveDraft } = useDraftStore();
  const { clearImageUris, setImageUris } = useComposeStore();

  const handleDiscard = () => {
    clearImageUris();
    onClose();
    router.back();
  };

  const handleSave = () => {
    saveDraft({ imageUris: images });
    setImageUris(images);
    onClose();
    router.back();
  };

  return (
    <CenterModal visible={visible} onClose={onClose}>
      <View className="bg-semantic-bg-primary rounded-[6px] px-4 pt-6 pb-4 gap-5">
        <Text
          className="text-base font-semibold text-semantic-text-secondary"
          style={{ letterSpacing: -0.32, lineHeight: 25.6 }}
        >
          지금까지 작성된 내용을 임시저장할까요?
        </Text>
        <View className="flex-row gap-1.5">
          <View className="flex-1">
            <Button
              button={{
                label: "삭제",
                onPress: handleDiscard,
                variant: "secondary",
                size: "lg",
              }}
            />
          </View>
          <View className="flex-1">
            <Button
              button={{
                label: "임시저장",
                onPress: handleSave,
                size: "lg",
              }}
            />
          </View>
        </View>
      </View>
    </CenterModal>
  );
};

export default DraftModal;
