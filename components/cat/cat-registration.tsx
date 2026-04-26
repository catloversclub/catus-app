import PlusIcon from "@/assets/icons/plus.svg";
import { dark, light } from "@/styles/semantic-colors";
import { Text, useColorScheme, View } from "react-native";

const CatRegistration = () => {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? dark : light;
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
