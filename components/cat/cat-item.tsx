// components/cat/cat-item.tsx
import { Cat } from "@/api/domains/cat/types";
import { Image } from "expo-image";
import { Text, useColorScheme, View } from "react-native";

interface CatItemProps {
  cat: Cat;
}

const CatItem = ({ cat }: CatItemProps) => {
  const scheme = useColorScheme();
  const defaultAvatar =
    scheme === "dark"
      ? require("@/assets/images/avatar/user-dark.png")
      : require("@/assets/images/avatar/user-light.png");
  const imageSource = cat.profileImageUrl
    ? { uri: cat.profileImageUrl }
    : defaultAvatar;

  return (
    <View className="items-center flex-col gap-1">
      <View className="size-[54px] rounded-full border border-semantic-border-primary overflow-hidden">
        <Image
          source={imageSource}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
        />
      </View>
      <Text className="text-semantic-text-secondary typo-label1">
        {cat.name}
      </Text>
    </View>
  );
};

export default CatItem;
