import Button from "@/components/common/button";
import CenterModal from "@/components/modal/center-modal";
import { useErrorStore } from "@/store/error-store";
import { Text, View } from "react-native";

const ErrorModal = () => {
  const { error, clearError } = useErrorStore();

  return (
    <CenterModal visible={!!error} onClose={clearError}>
      <View className="bg-semantic-bg-primary p-4 flex-col rounded-lg">
        <Text className="typo-body1 text-semantic-text-secondary mb-1.5">
          {error?.title ?? "오류가 발생했어요"}
        </Text>
        <Text className="typo-body4 text-semantic-text-tertiary mb-5">
          {error?.message ?? "잠시 후 다시 시도해주세요"}
        </Text>
        <View className="flex-row gap-1.5">
          <View className="flex-1">
            <Button
              button={{
                label: "확인",
                onPress: clearError,
                variant: "primary",
                size: "lg",
              }}
            />
          </View>
        </View>
      </View>
    </CenterModal>
  );
};

export default ErrorModal;
