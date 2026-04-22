import { Text, View } from "react-native";

interface ThumbnailProps {
  postId: string;
  size: number;
}

export const Thumbnail = ({ postId, size }: ThumbnailProps) => {
  return (
    <View
      className="bg-red-200 w-full h-full flex-row items-center justify-center"
      style={{ width: size, height: size }}
    >
      <Text>{postId} 썸네일</Text>
    </View>
  );
};
