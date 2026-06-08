import ArrowLeftIcon from "@/assets/icons/arrow-left.svg";
import IconButton from "@/components/common/icon-button";
import { useColors } from "@/hooks/use-colors";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ScreenHeaderProps {
  title: string;
  onBack: () => void;
  variant?: "default" | "editor";
}

const ScreenHeader = ({ title, onBack, variant = "default" }: ScreenHeaderProps) => {
  const { top } = useSafeAreaInsets();
  const { colors } = useColors();

  const iconColor = variant === "editor" ? "#FDFDFD" : colors.icon.primary;
  const textClassName =
    variant === "editor" ? "text-gray-0" : "text-semantic-text-primary";

  return (
    <View style={{ paddingTop: top }}>
      <View className="flex-row items-center h-[52px] px-3">
        <IconButton onPress={onBack} className="p-3">
          <ArrowLeftIcon width={20} height={20} color={iconColor} />
        </IconButton>
        <Text className={`flex-1 text-center typo-body1 mr-11 ${textClassName}`}>
          {title}
        </Text>
      </View>
    </View>
  );
};

export { ScreenHeader };
