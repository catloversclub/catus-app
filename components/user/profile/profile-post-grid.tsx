import { Post } from "@/api/domains/post/types";
import ActionPressable from "@/components/common/action-pressable";
import { LoadMoreFooter } from "@/components/common/load-more-footer";
import { Skeleton } from "@/components/ui/skeleton";
import { SquareImage } from "@/components/ui/square-image";
import { FlatList, Text, View, useWindowDimensions } from "react-native";

type PostRowItem = { type: "row"; posts: Post[] };
type EmptyItem = { type: "empty"; message: string };
type LoaderItem = { type: "loader" };
type TabBarItem = { type: "tabBar" };
type ListItem = TabBarItem | PostRowItem | EmptyItem | LoaderItem;

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
    <ActionPressable href={`/post/${post.id}`} style={{ width: size, height: size }}>
      <SquareImage uri={post.images[0]?.url} size={size} />
    </ActionPressable>
  );
};

interface ProfilePostGridProps {
  ListHeaderComponent?: React.ComponentType;
  tabBar?: React.ReactElement;
  posts: Post[];
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  emptyMessage: string;
  logoOverlay?: React.ReactNode;
  loadMoreRef?: React.RefObject<(() => void) | null>;
}

const ProfilePostGrid = ({
  ListHeaderComponent,
  tabBar,
  posts,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  emptyMessage,
  logoOverlay,
  loadMoreRef,
}: ProfilePostGridProps) => {
  if (loadMoreRef) {
    loadMoreRef.current = () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    };
  }

  const { width } = useWindowDimensions();
  const size = (width - 4) / 3;

  const hasStickyTabBar = !!tabBar;

  const postRows: PostRowItem[] = [];
  for (let i = 0; i < posts.length; i += 3) {
    postRows.push({ type: "row", posts: posts.slice(i, i + 3) });
  }

  const data: ListItem[] = [
    ...(hasStickyTabBar ? [{ type: "tabBar" as const }] : []),
    ...(posts.length === 0
      ? [{ type: "empty" as const, message: emptyMessage }]
      : postRows),
    ...(isFetchingNextPage ? [{ type: "loader" as const }] : []),
  ];

  const renderItem = ({ item }: { item: ListItem }) => {
    if (item.type === "tabBar") {
      return tabBar ?? null;
    }
    if (item.type === "empty") {
      return (
        <View className="py-12 items-center justify-center">
          <Text className="typo-body1 text-semantic-text-tertiary">
            {item.message}
          </Text>
        </View>
      );
    }
    if (item.type === "loader") {
      return <LoadMoreFooter />;
    }
    return (
      <View style={{ flexDirection: "row", gap: 2 }}>
        {item.posts.map((post) => (
          <PostThumbnail key={post.id} post={post} size={size} />
        ))}
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {logoOverlay}
      <FlatList
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        ListHeaderComponent={ListHeaderComponent}
        data={data}
        keyExtractor={(item, index) => {
          if (item.type === "tabBar") return "tabBar";
          if (item.type === "empty") return "empty";
          if (item.type === "loader") return "loader";
          return `row-${index}`;
        }}
        renderItem={renderItem}
        ItemSeparatorComponent={({ leadingItem }) =>
          hasStickyTabBar &&
          (leadingItem as ListItem)?.type === "tabBar" ? null : (
            <View style={{ height: 2 }} />
          )
        }
        scrollEnabled={false}
      />
    </View>
  );
};

export { PostGridSkeleton, PostThumbnail };
export default ProfilePostGrid;
