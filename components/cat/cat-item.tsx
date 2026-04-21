// components/cat/cat-item.tsx
import { Image } from "expo-image";
import { Text, useColorScheme, View } from "react-native";

interface CatItemProps {
  cat: {
    id: string;
    name: string;
    profileImageUrl: string | null;
  };
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
    <View className="items-center gap-1.5 mr-3">
      <View className="w-16 h-16 rounded-full overflow-hidden border-2 border-semantic-border-primary">
        <Image
          source={imageSource}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
        />
      </View>
      <Text className="text-semantic-text-primary typo-body4">{cat.name}</Text>
    </View>
  );
};

export default CatItem;
