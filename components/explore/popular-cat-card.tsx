import { LinearGradient } from "expo-linear-gradient";
import { Image, Text, View } from "react-native";

export interface PopularCat {
  id: string;
  name: string;
  breed?: string;
  tags: string[];
  photos: string[];
}

interface PopularCatCardProps {
  cat: PopularCat;
  height?: number;
}

const PopularCatCard = ({ cat, height = 336 }: PopularCatCardProps) => {
  const photo = cat.photos[0];
  const firstRowTags = cat.tags.slice(0, 2);
  const secondRowTags = cat.tags.slice(2, 4);

  return (
    <View className="w-full rounded-md overflow-hidden justify-end p-3" style={{ height }}>
      {photo && (
        <Image
          source={{ uri: photo }}
          className="absolute inset-0 w-full h-full"
          resizeMode="cover"
        />
      )}
      <LinearGradient
        colors={["rgba(27,27,27,0)", "rgba(27,27,27,0.7)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        locations={[0.6, 1]}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          top: 0,
        }}
        pointerEvents="none"
      />
      <View className="gap-4">
        <View className="gap-1.5">
          <View className="gap-0.5">
            <Text className="typo-title2 text-white">{cat.name}</Text>
            {cat.breed && (
              <Text className="typo-body4 text-[#E7E7E7]">{cat.breed}</Text>
            )}
          </View>
          {/* tags - 3개 이상 시 2줄 처리 */}
          <View className="gap-1">
            {firstRowTags.length > 0 && (
              <View className="flex-row gap-1.5">
                {firstRowTags.map((tag) => (
                  <View
                    key={tag}
                    className="px-2.5 py-1 rounded bg-[rgba(27,27,27,0.2)]"
                  >
                    <Text className="typo-label1 text-[#F6F6F6]">{tag}</Text>
                  </View>
                ))}
              </View>
            )}
            {secondRowTags.length > 0 && (
              <View className="flex-row gap-1.5">
                {secondRowTags.map((tag) => (
                  <View
                    key={tag}
                    className="px-2.5 py-1 rounded bg-[rgba(27,27,27,0.2)]"
                  >
                    <Text className="typo-label1 text-[#F6F6F6]">{tag}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
        {/* pagination dots */}
        {cat.photos.length > 1 && (
          <View className="flex-row justify-center gap-1.5">
            {cat.photos.map((_, i) => (
              <View
                key={i}
                className={`size-1.5 rounded-full ${i === 0 ? "bg-semantic-icon-accent" : "bg-semantic-icon-minor"}`}
              />
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

export default PopularCatCard;
