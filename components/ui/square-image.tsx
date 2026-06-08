import { Image } from "expo-image";
import { View } from "react-native";

interface SquareImageProps {
  uri: string | undefined;
  size: number;
}

const SquareImage = ({ uri, size }: SquareImageProps) => {
  if (!uri) {
    return (
      <View
        style={{ width: size, height: size }}
        className="bg-semantic-bg-secondary"
      />
    );
  }

  return (
    <Image
      source={{ uri }}
      style={{ width: size, height: size, borderRadius: 4 }}
      contentFit="cover"
    />
  );
};

export { SquareImage };
