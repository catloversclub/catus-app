import PlusIcon from "@/assets/icons/plus.svg";
import { useColors } from "@/hooks/use-colors";
import { Text, View } from "react-native";

const CatRegistration = () => {
  const { colors } = useColors();
  return (
    <View className="flex-col gap-1">
      <View className="size-[54px] rounded-full bg-semantic-bg-secondary border border-semantic-border-primary items-center justify-center">
        <PlusIcon width={24} height={24} color={colors.icon.secondary} />
      </View>
      <Text className="text-semantic-text-secondary typo-label1">
        고양이 추가
      </Text>
    </View>
  );
};

export default CatRegistration;
