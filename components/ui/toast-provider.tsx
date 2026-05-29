import AlertIcon from "@/assets/icons/alert.svg";
import CheckboxFilledIcon from "@/assets/icons/checkbox-filled.svg";
import XCircleIcon from "@/assets/icons/x-circle.svg";
import { useColors } from "@/hooks/use-colors";
import { Text, View } from "react-native";
import Toast, { ToastConfig } from "react-native-toast-message";

export function ToastProvider() {
  const { colors } = useColors();

  const toastConfig: ToastConfig = {
    success: ({ text1 }) => (
      <View
        style={{
          width: "90%",
          backgroundColor: colors.bg.secondary,
          borderRadius: 4,
          borderWidth: 1,
          borderColor: colors.border.primary,
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowRadius: 7.5,
          elevation: 4,
        }}
        className="py-3 px-[10px] flex-row gap-1.5 items-center"
      >
        <CheckboxFilledIcon width={16} height={16} color={colors.icon.success} />
        <Text
          className="typo-body4 text-semantic-text-primary flex-1"
          numberOfLines={1}
        >
          {text1}
        </Text>
      </View>
    ),
    error: ({ text1 }) => (
      <View
        style={{
          width: "90%",
          backgroundColor: colors.bg.secondary,
          borderRadius: 4,
          borderWidth: 1,
          borderColor: colors.border.primary,
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowRadius: 7.5,
          elevation: 4,
        }}
        className="py-3 px-[10px] flex-row gap-1.5 items-center"
      >
        <AlertIcon width={16} height={16} color={colors.icon.error} />
        <Text
          className="typo-body4 text-semantic-text-primary flex-1"
          numberOfLines={1}
        >
          {text1}
        </Text>
      </View>
    ),
  };

  return <Toast config={toastConfig} position="bottom" bottomOffset={80} />;
}
