import { useLogin } from "@/api/domains/auth/queries";
import AppleLogo from "@/assets/icons/apple.svg";
import GoogleLogo from "@/assets/icons/google.svg";
import KakaoLogo from "@/assets/icons/kakao.svg";
import FeatureCarousel from "@/components/auth/feature-carousel";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";
import { Linking, Platform, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Provider = "kakao" | "google" | "apple";

interface LoginOption {
  id: Provider;
  label: string;
  containerClass: string;
  textClass?: string;
  Icon: React.ElementType;
}

const appleOption: LoginOption = {
  id: "apple",
  label: "Apple 로그인",
  containerClass: "bg-black dark:bg-gray-0",
  textClass: "text-white dark:text-black",
  Icon: AppleLogo,
};

const LOGIN_OPTIONS: LoginOption[] = [
  {
    id: "kakao",
    label: "카카오 로그인",
    containerClass: "bg-[#FEE500]",
    Icon: KakaoLogo,
  },
  {
    id: "google",
    label: "Google 로그인",
    containerClass: "bg-[#F2F2F2]",
    Icon: GoogleLogo,
  },
  ...(Platform.OS === "ios" ? [appleOption] : []),
];

const Index = () => {
  const { mutate: login } = useLogin();
  const { colors } = useColors();

  return (
    <SafeAreaView className="flex-1 items-center bg-semantic-bg-primary ">
      <View className="items-center justify-center flex-1">
        <FeatureCarousel />
      </View>
      <View className="w-full flex-col gap-2 pb-4 px-4">
        {LOGIN_OPTIONS.map(({ id, label, containerClass, textClass, Icon }) => (
          <TouchableOpacity
            key={id}
            onPress={() => login(id)}
            className={cn(
              "w-full flex-row items-center justify-center gap-3 rounded-md py-4",
              containerClass,
            )}
          >
            <Icon
              className="size-10"
              color={id === "apple" ? colors.bg.primary : undefined}
            />
            <Text className={cn("typo-body1", textClass)}>{label}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          onPress={() => Linking.openURL("mailto:support@catus.app")}
          className="w-full items-center justify-center py-4"
        >
          <Text className="typo-body4 text-semantic-button-ghost-text underline">
            로그인 과정에 문제가 있나요?
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Index;
