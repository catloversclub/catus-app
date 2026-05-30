import { useColors } from "@/hooks/use-colors";
import { Skeleton } from "moti/skeleton";
import { useWindowDimensions, View } from "react-native";

const FeedCardSkeleton = () => {
  const { scheme } = useColors();
  const colorMode = scheme === "dark" ? "dark" : "light";
  const { width } = useWindowDimensions();
  const imageSize = width - 24;

  return (
    <Skeleton.Group show>
      <View style={{ marginBottom: 20, gap: 12, paddingHorizontal: 12 }}>
        <Skeleton colorMode={colorMode} width={imageSize} height={imageSize} radius={6} />
        <View style={{ flexDirection: "row", gap: 6, justifyContent: "center" }}>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} colorMode={colorMode} width={6} height={6} radius="round" />
          ))}
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Skeleton colorMode={colorMode} width={36} height={36} radius="round" />
          <View style={{ gap: 6 }}>
            <Skeleton colorMode={colorMode} width={96} height={14} radius={4} />
            <Skeleton colorMode={colorMode} width={56} height={12} radius={4} />
          </View>
        </View>
      </View>
    </Skeleton.Group>
  );
};

export const FeedListSkeleton = () => (
  <View style={{ flex: 1, paddingTop: 4 }}>
    <FeedCardSkeleton />
    <FeedCardSkeleton />
  </View>
);
