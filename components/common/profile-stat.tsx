import ActionPressable from "@/components/common/action-pressable";
import { type Href } from "expo-router";
import { Text, View } from "react-native";

type ProfileStatItem = {
  label: string;
  value: number;
  href?: Href;
};

const ProfileStat = ({ label, value, href }: ProfileStatItem) => {
  const content = (
    <View className="flex-row gap-1 px-3 py-1.5">
      <Text className="typo-body4 text-semantic-text-tertiary">{label}</Text>
      <Text className="typo-body3 text-semantic-text-secondary">{value}</Text>
    </View>
  );
  if (href) {
    return <ActionPressable href={href}>{content}</ActionPressable>;
  }
  return content;
};

export type { ProfileStatItem };
export { ProfileStat };
