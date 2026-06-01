import { useMyCatsQuery } from "@/api/domains/cat/queries";
import {
  useMyBookmarkedPostsQuery,
  useMyLikedPostsQuery,
  useMyPostsQuery,
} from "@/api/domains/post/queries";
import AppsIcon from "@/assets/icons/apps.svg";
import BookmarkIcon from "@/assets/icons/bookmark.svg";
import ChevronRightIcon from "@/assets/icons/chevron-right.svg";
import HeartOutlineIcon from "@/assets/icons/heart-outline.svg";
import SettingsIcon from "@/assets/icons/settings.svg";
import CatList from "@/components/cat/cat-list";
import CatRegistration from "@/components/cat/cat-registration";
import IconButton from "@/components/common/icon-button";
import ProfilePostGrid, {
  PostGridSkeleton,
} from "@/components/user/profile-post-grid";
import ProfileActions from "@/components/user/my-profile-actions";
import ProfileInfo from "@/components/user/profile-info";
import { useColors } from "@/hooks/use-colors";
import { Link, Stack } from "expo-router";
import { Suspense, useState } from "react";
import {
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
};

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
};

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
};

// ─── Page content ────────────────────────────────────────────

const MypageContent = () => {
  const [activeTab, setActiveTab] = useState(0);

  const myPostsQuery = useMyPostsQuery();
  const likedQuery = useMyLikedPostsQuery();
  const bookmarkedQuery = useMyBookmarkedPostsQuery();

  const queries = [myPostsQuery, likedQuery, bookmarkedQuery];
  const activeQuery = queries[activeTab];
  const posts = activeQuery.data.pages.flat();

  return (
    <ProfilePostGrid
      ListHeaderComponent={ProfileHeader}
      tabBar={
        <TabIconBar activeIndex={activeTab} onChange={setActiveTab} />
      }
      posts={posts}
      isFetchingNextPage={activeQuery.isFetchingNextPage}
      hasNextPage={activeQuery.hasNextPage}
      fetchNextPage={activeQuery.fetchNextPage}
      emptyMessage={EMPTY_MESSAGES[activeTab]}
    />
  );
};

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
};

export default Mypage;
