import { useLogin } from "@/api/domains/auth/queries";
import AppleLogo from "@/assets/icons/apple.svg";
import GoogleLogo from "@/assets/icons/google.svg";
import KakaoLogo from "@/assets/icons/kakao.svg";
import Carousel from "@/components/common/carousel";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";
import { Image } from "expo-image";
import {
  Dimensions,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Provider = "kakao" | "google" | "apple";

interface LoginOption {
  id: Provider;
  label: string;
  containerClass: string;
  textClass?: string;
  Icon: React.ElementType;
}

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
  {
    id: "apple",
    label: "Apple 로그인",
    containerClass: "bg-black dark:bg-gray-0",
    textClass: "text-white dark:text-black",
    Icon: AppleLogo,
  },
];

export default function Index() {
  const { mutate: login } = useLogin();
  const { colors } = useColors();

  return (
    <SafeAreaView className="flex-1 items-center bg-semantic-bg-primary ">
      <View className="items-center justify-center flex-1">
        <FeatureCarousel />
      </View>
      <View className="w-full flex-col gap-2 pb-16 px-4">
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
      </View>
    </SafeAreaView>
  );
}

const FEATURES: ImageSourcePropType[] = [
  require("@/assets/images/feature/light-1.png"),
  require("@/assets/images/feature/light-2.png"),
  require("@/assets/images/feature/light-3.png"),
  require("@/assets/images/feature/light-4.png"),
];

const DARK_FEATURES: ImageSourcePropType[] = [
  require("@/assets/images/feature/dark-1.png"),
  require("@/assets/images/feature/dark-2.png"),
  require("@/assets/images/feature/dark-3.png"),
  require("@/assets/images/feature/dark-4.png"),
];

const FEATURE_TEXTS = [
  "고양이의 일상을\n공유하는 공간",
  "고양이의 매력을\n발산하는 공간",
  "공감하고\n소통해요",
  "인기 있는\n냥이들을 만나보세요",
];

const { width } = Dimensions.get("window");

const FeatureCarousel = () => {
  const { scheme } = useColors();

  const images = scheme === "dark" ? DARK_FEATURES : FEATURES;

  return (
    <Carousel
      images={images}
      renderItem={({ index, item }) => (
        <View className="flex-col gap-6 items-center">
          <Text className="typo-title1 text-semantic-text-primary text-center">
            {FEATURE_TEXTS[index]}
          </Text>
          <Image
            source={item}
            style={{ width, height: 300 }}
            contentFit="contain"
          />
        </View>
      )}
    />
  );
};
