import { Text, View } from "react-native";

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

const SettingsSection = ({ title, children }: SettingsSectionProps) => {
  return (
    <View className="flex-col gap-1.5">
      <Text className="text-semantic-text-tertiary typo-body4">{title}</Text>
      <View className="flex-col">{children}</View>
    </View>
  );
};

export default SettingsSection;
