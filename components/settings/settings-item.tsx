import ChevronRightIcon from "@/assets/icons/chevron-right.svg";
import Toggle from "@/components/common/toggle";
import { dark, light } from "@/styles/semantic-colors";
import { Text, useColorScheme, View } from "react-native";
import { Pressable } from "react-native-gesture-handler";

interface SettingsSectionProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const SettingsToggleItem = ({
  label,
  value,
  onValueChange,
}: SettingsSectionProps) => {
  return (
    <View className="flex-row justify-between items-center py-4 px-3">
      <Text className="text-semantic-text-primary typo-body3">{label}</Text>
      <Toggle value={value} onValueChange={onValueChange} />
    </View>
  );
};

interface SettingsLinkItemProps {
  label: string;
  value?: string;
  onPress?: () => void;
  hideButton?: boolean;
}

const SettingsLinkItem = ({
  label,
  value,
  onPress,
  hideButton = false,
}: SettingsLinkItemProps) => {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? dark : light;
  return (
    <Pressable onPress={onPress}>
      <View className="flex-row justify-between items-center py-4 px-3">
        <Text className="text-semantic-text-primary typo-body3">{label}</Text>

        <View className="flex-row gap-1.5 items-center">
          <Text className="text-semantic-text-tertiary typo-body4">
            {value}
          </Text>
          {!hideButton && (
            <ChevronRightIcon
              width={16}
              height={16}
              stroke={colors.icon.secondary}
            />
          )}
        </View>
      </View>
    </Pressable>
  );
};

export { SettingsLinkItem, SettingsToggleItem };
