import { useMyCatsQuery } from "@/api/domains/cat/queries";
import {
  useMyBookmarkedPostsQuery,
  useMyLikedPostsQuery,
  useMyPostsQuery,
} from "@/api/domains/post/queries";
import { Post } from "@/api/domains/post/types";
import AppsIcon from "@/assets/icons/apps.svg";
import BookmarkIcon from "@/assets/icons/bookmark.svg";
import ChevronRightIcon from "@/assets/icons/chevron-right.svg";
import HeartOutlineIcon from "@/assets/icons/heart-outline.svg";
import SettingsIcon from "@/assets/icons/settings.svg";
import CatList from "@/components/cat/cat-list";
import CatRegistration from "@/components/cat/cat-registration";
import IconButton from "@/components/common/icon-button";
import ProfileActions from "@/components/user/my-profile-actions";
import ProfileInfo from "@/components/user/profile-info";
import { useColors } from "@/hooks/use-colors";
import { Image } from "expo-image";
import { Link, Stack } from "expo-router";
import { Skeleton } from "moti/skeleton";
import { Suspense, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

const TAB_ICONS = [AppsIcon, HeartOutlineIcon, BookmarkIcon] as const;
const EMPTY_MESSAGES = [
  "게시글이 없어요",
  "좋아요한 게시글이 없어요",
  "저장한 게시글이 없어요",
];

// ─── List item types ─────────────────────────────────────────

type TabBarItem = { type: "tabBar" };
type PostRowItem = { type: "row"; posts: Post[] };
type EmptyItem = { type: "empty"; message: string };
type LoaderItem = { type: "loader" };
type ListItem = TabBarItem | PostRowItem | EmptyItem | LoaderItem;

// ─── Skeleton ────────────────────────────────────────────────

const PostGridSkeleton = () => {
  const { scheme } = useColors();
  const colorMode = scheme === "dark" ? "dark" : "light";
  const { width } = useWindowDimensions();
  const size = Math.floor((width - 4) / 3);

  return (
    <Skeleton.Group show>
      <View style={{ gap: 2 }}>
        {[0, 1, 2].map((row) => (
          <View key={row} style={{ flexDirection: "row", gap: 2 }}>
            {[0, 1, 2].map((col) => (
              <Skeleton
                key={col}
                colorMode={colorMode}
                width={size}
                height={size}
                radius={0}
              />
            ))}
          </View>
        ))}
      </View>
    </Skeleton.Group>
  );
}

// ─── Tab icon bar ────────────────────────────────────────────

const TabIconBar = ({
  activeIndex,
  onChange,
}: {
  activeIndex: number;
  onChange: (i: number) => void;
}) => {
  const { colors } = useColors();
  const { width } = useWindowDimensions();
  const tabWidth = width / TAB_ICONS.length;

  return (
    <View className="bg-semantic-bg-primary">
      <View style={{ height: 46, flexDirection: "row" }}>
        {TAB_ICONS.map((Icon, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => onChange(index)}
            style={{ height: 46, flex: 1 }}
            className="items-center justify-center"
          >
            <Icon
              width={24}
              height={24}
              color={
                activeIndex === index
                  ? colors.icon.primary
                  : colors.icon.tertiary
              }
            />
          </TouchableOpacity>
        ))}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: activeIndex * tabWidth,
            width: tabWidth,
            height: 1,
            backgroundColor: colors.border.accent,
          }}
        />
      </View>
      <View className="h-px bg-semantic-border-primary" />
    </View>
  );
}

// ─── Post thumbnail ──────────────────────────────────────────

const PostThumbnail = ({ post, size }: { post: Post; size: number }) => {
  const imageUrl = post.images[0]?.url;
  return (
    <Link href={`/post/${post.id}`} asChild>
      <Pressable style={{ width: size, height: size }}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={{ width: size, height: size }}
            contentFit="cover"
          />
        ) : (
          <View
            style={{ width: size, height: size }}
            className="bg-semantic-bg-secondary"
          />
        )}
      </Pressable>
    </Link>
  );
}

// ─── Cat section ─────────────────────────────────────────────

const MyCatListSection = () => {
  const { colors } = useColors();
  const { data: catData } = useMyCatsQuery();
  const hasCats = catData.length > 0;

  return (
    <>
      <View className="w-full flex-row justify-between items-center px-5 mb-3">
        <Text className="text-semantic-text-secondary typo-body3">
          함께 사는 고양이
        </Text>
        <Link href="/cat/list" asChild>
          <IconButton className="active:opacity-60">
            <ChevronRightIcon
              width={16}
              height={16}
              color={colors.icon.secondary}
            />
          </IconButton>
        </Link>
      </View>
      {hasCats ? (
        <View className="flex-row items-center pr-5">
          <View className="flex-1">
            <CatList />
          </View>
          <CatRegistration />
        </View>
      ) : (
        <View className="pl-5">
          <CatRegistration />
        </View>
      )}
    </>
  );
}

// ─── Profile header (ListHeaderComponent) ────────────────────

const ProfileHeader = () => {
  return (
    <View className="pt-6">
      <ProfileInfo />
      <ProfileActions />
      <Suspense fallback={null}>
        <MyCatListSection />
      </Suspense>
      <View className="h-6" />
    </View>
  );
}

// ─── Page content ────────────────────────────────────────────

const MypageContent = () => {
  const { width } = useWindowDimensions();
  const size = (width - 4) / 3;

  const [activeTab, setActiveTab] = useState(0);

  const myPostsQuery = useMyPostsQuery();
  const likedQuery = useMyLikedPostsQuery();
  const bookmarkedQuery = useMyBookmarkedPostsQuery();

  const queries = [myPostsQuery, likedQuery, bookmarkedQuery];
  const activeQuery = queries[activeTab];
  const posts = activeQuery.data.pages.flat();

  const postRows: PostRowItem[] = [];
  for (let i = 0; i < posts.length; i += 3) {
    postRows.push({ type: "row", posts: posts.slice(i, i + 3) });
  }

  const data: ListItem[] = [
    { type: "tabBar" },
    ...(posts.length === 0
      ? [{ type: "empty" as const, message: EMPTY_MESSAGES[activeTab] }]
      : postRows),
    ...(activeQuery.isFetchingNextPage
      ? [{ type: "loader" as const }]
      : []),
  ];

  const renderItem = ({ item }: { item: ListItem }) => {
    if (item.type === "tabBar") {
      return <TabIconBar activeIndex={activeTab} onChange={setActiveTab} />;
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
      return (
        <ActivityIndicator size="small" style={{ marginVertical: 12 }} />
      );
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
    <FlatList
      style={{ flex: 1 }}
      ListHeaderComponent={ProfileHeader}
      data={data}
      stickyHeaderIndices={[0]}
      keyExtractor={(item, index) => {
        if (item.type === "tabBar") return "tabBar";
        if (item.type === "empty") return "empty";
        if (item.type === "loader") return "loader";
        return `row-${index}`;
      }}
      renderItem={renderItem}
      ItemSeparatorComponent={({ leadingItem }) =>
        leadingItem?.type === "tabBar" ? null : (
          <View style={{ height: 2 }} />
        )
      }
      onEndReached={() => {
        if (activeQuery.hasNextPage && !activeQuery.isFetchingNextPage) {
          activeQuery.fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.5}
    />
  );
}

// ─── Page ────────────────────────────────────────────────────

const Mypage = () => {
  const { colors } = useColors();

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerShadowVisible: false,
          title: "마이페이지",
          headerTintColor: colors.text.primary,
          headerStyle: { backgroundColor: colors.bg.primary },
          headerRight: () => (
            <Link href="/settings" asChild>
              <IconButton className="p-3 active:opacity-60">
                <SettingsIcon
                  width={24}
                  height={24}
                  color={colors.icon.primary}
                />
              </IconButton>
            </Link>
          ),
        }}
      />

      <View className="flex-1 bg-semantic-bg-primary">
        <Suspense fallback={<PostGridSkeleton />}>
          <MypageContent />
        </Suspense>
      </View>
    </>
  );
}

export default Mypage;
