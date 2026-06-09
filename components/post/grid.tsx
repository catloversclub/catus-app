import { Post } from "@/api/domains/post/types";
import ImagePressable from "@/components/common/image-pressable";
import { LoadMoreFooter } from "@/components/common/load-more-footer";
import { Skeleton } from "@/components/ui/skeleton";
import { SquareImage } from "@/components/ui/square-image";
import {
  FlatList,
  RefreshControlProps,
  View,
  useWindowDimensions,
} from "react-native";

const PostGridSkeleton = () => {
  const { width } = useWindowDimensions();
  const size = Math.floor((width - 4) / 3);

  return (
    <View style={{ gap: 2 }}>
      {[0, 1, 2].map((row) => (
        <View key={row} style={{ flexDirection: "row", gap: 2 }}>
          {[0, 1, 2].map((col) => (
            <Skeleton
              key={col}
              className="rounded-none"
              style={{ width: size, height: size }}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

interface PostThumbnailProps {
  post: Post;
  size: number;
}

const PostThumbnail = ({ post, size }: PostThumbnailProps) => {
  return (
    <ImagePressable
      href={`/post/${post.id}`}
      style={{ width: size, height: size }}
    >
      <SquareImage uri={post.images[0]?.url} size={size} />
    </ImagePressable>
  );
};

interface PostGridProps {
  ListHeaderComponent: React.ReactElement;
  posts: Post[];
  isFetchingNextPage: boolean;
  emptyComponent: React.ReactElement;
  scrollEnabled?: boolean;
  refreshControl?: React.ReactElement<RefreshControlProps>;
  onEndReached?: () => void;
}

const PostGrid = ({
  ListHeaderComponent,
  posts,
  isFetchingNextPage,
  emptyComponent,
  scrollEnabled = false,
  refreshControl,
  onEndReached,
}: PostGridProps) => {
  const { width } = useWindowDimensions();

  const GAP = 6;
  const NUM_COLS = 3;
  const PADDING = 24;

  const size = (width - (NUM_COLS - 1) * GAP - PADDING) / NUM_COLS;

  const rows: Post[][] = [];
  for (let i = 0; i < posts.length; i += NUM_COLS) {
    rows.push(posts.slice(i, i + NUM_COLS));
  }

  const fillerRows = rows.length > 0 ? Math.max(0, NUM_COLS - rows.length) : 0;
  const fillerHeight = fillerRows * (size + GAP) - GAP;

  return (
    <FlatList
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      ListHeaderComponent={
        <View style={{ marginBottom: 24 }}>{ListHeaderComponent}</View>
      }
      ListEmptyComponent={
        <View style={{ minHeight: size * NUM_COLS + GAP * (NUM_COLS - 1) }}>
          {emptyComponent}
        </View>
      }
      ListFooterComponent={
        <>
          {isFetchingNextPage && <LoadMoreFooter />}
          {fillerRows > 0 && <View style={{ height: fillerHeight }} />}
        </>
      }
      data={rows}
      keyExtractor={(_, index) => `row-${index}`}
      renderItem={({ item: row }) => (
        <View className="flex-row px-3" style={{ gap: GAP }}>
          {row.map((post) => (
            <PostThumbnail key={post.id} post={post} size={size} />
          ))}
        </View>
      )}
      ItemSeparatorComponent={() => <View style={{ height: GAP }} />}
      scrollEnabled={scrollEnabled}
      refreshControl={refreshControl}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
    />
  );
};

export { PostGridSkeleton };
export default PostGrid;
