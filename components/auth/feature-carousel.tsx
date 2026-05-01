import dark1 from "@/assets/images/feature/dark-1.png";
import dark2 from "@/assets/images/feature/dark-2.png";
import dark3 from "@/assets/images/feature/dark-3.png";
import dark4 from "@/assets/images/feature/dark-4.png";
import light1 from "@/assets/images/feature/light-1.png";
import light2 from "@/assets/images/feature/light-2.png";
import light3 from "@/assets/images/feature/light-3.png";
import light4 from "@/assets/images/feature/light-4.png";
import Carousel from "@/components/common/carousel";
import { useColors } from "@/hooks/use-colors";
import { Image } from "expo-image";
import { Dimensions, Text, View } from "react-native";

const FEATURES = [light1, light2, light3, light4];
const DARK_FEATURES = [dark1, dark2, dark3, dark4];
const FEATURE_TEXTS = [
  "고양이의 일상을\n공유하는 공간",
  "고양이의 매력을\n발산하는 공간",
  "공감하고\n소통해요",
  "인기 있는\n냥이들을 만나보세요",
];
const IMAGE_HEIGHT = 300;

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
            style={{ width, height: IMAGE_HEIGHT }}
            contentFit="contain"
          />
        </View>
      )}
    />
  );
};

export default FeatureCarousel;
