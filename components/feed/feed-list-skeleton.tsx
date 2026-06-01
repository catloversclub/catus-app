import { Skeleton } from "@/components/ui/skeleton";
import { useWindowDimensions, View } from "react-native";

const FeedCardSkeleton = () => {
  const { width } = useWindowDimensions();
  const imageSize = width - 24;

  return (
    <View style={{ marginBottom: 20, gap: 12, paddingHorizontal: 12 }}>
      <Skeleton style={{ width: imageSize, height: imageSize }} />
      <View style={{ flexDirection: "row", gap: 6, justifyContent: "center" }}>
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="rounded-full" style={{ width: 6, height: 6 }} />
        ))}
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <Skeleton className="rounded-full" style={{ width: 36, height: 36 }} />
        <View style={{ gap: 6 }}>
          <Skeleton className="rounded" style={{ width: 96, height: 14 }} />
          <Skeleton className="rounded" style={{ width: 56, height: 12 }} />
        </View>
      </View>
    </View>
  );
};

const FeedListSkeleton = () => (
  <View style={{ flex: 1, paddingTop: 4 }}>
    <FeedCardSkeleton />
    <FeedCardSkeleton />
  </View>
);

export default FeedListSkeleton;
