// components/toast-provider.tsx
import XLogo from "@/assets/icons/x-circle.svg";
import { useColors } from "@/hooks/use-colors";
import { Text, View } from "react-native";
import Toast, { BaseToast, ToastConfig } from "react-native-toast-message";

export function ToastProvider() {
  const { colors } = useColors();

  const toastConfig: ToastConfig = {
    success: (props) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: "pink" }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{ fontSize: 15, fontWeight: "400" }}
      />
    ),
    error: ({ text1 }) => (
      <View
        style={{
          width: "90%",
          backgroundColor: colors.bg.primary,
          borderRadius: 4,
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 4,
        }}
        className="py-3 px-[10px] flex-row gap-1.5 items-center"
      >
        <XLogo width={16} height={16} color={colors.icon.error} />
        <Text className="typo-body4 text-semantic-text-primary">{text1}</Text>
      </View>
    ),
  };
  return <Toast config={toastConfig} position="bottom" bottomOffset={80} />;
}
