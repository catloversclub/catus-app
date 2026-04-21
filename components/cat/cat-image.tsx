import { PROFILE_SIZE } from "@/constants/user";
import { Image } from "expo-image";
import { useColorScheme } from "react-native";

interface CatImageProps {
  imageUrl: string;
  size: "sm" | "md" | "lg";
}

const CatImage = ({ imageUrl, size }: CatImageProps) => {
  const scheme = useColorScheme();
  const defaultAvatar =
    scheme === "dark"
      ? require("@/assets/images/avatar/user-dark.png")
      : require("@/assets/images/avatar/user-light.png");
  const imageSource = imageUrl ? { uri: imageUrl } : defaultAvatar;
  const sizeValue = PROFILE_SIZE[size];

  return (
    <Image
      source={imageSource}
      style={{
        width: sizeValue,
        height: sizeValue,
        borderRadius: sizeValue,
      }}
      contentFit="cover"
      alt={`Cat profile`}
    />
  );
};

export default CatImage;
