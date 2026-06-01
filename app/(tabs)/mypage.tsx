import { useMyCatsQuery } from "@/api/domains/cat/queries";
import {
  useMyBookmarkedPostsQuery,
  useMyLikedPostsQuery,
  useMyPostsQuery,
} from "@/api/domains/post/queries";
import { useUserProfileQuery } from "@/api/domains/user/queries";
import ChevronRightIcon from "@/assets/icons/chevron-right.svg";
import SettingsIcon from "@/assets/icons/settings.svg";
import CatList from "@/components/cat/cat-list";
import CatRegistration from "@/components/cat/cat-registration";
import IconButton from "@/components/common/icon-button";
import ProfileActions from "@/components/user/my-profile-actions";
import TabIconBar from "@/components/layout/tab-icon-bar";
import ProfileHeader, {
  ProfileHeaderSkeleton,
} from "@/components/user/profile-header";
import ProfilePostGrid, {
  PostGridSkeleton,
} from "@/components/user/profile-post-grid";
import { useColors } from "@/hooks/use-colors";
import { useDefaultStackScreenOptions } from "@/hooks/use-default-screen-options";
import { Link, Stack } from "expo-router";
import { Suspense, useState } from "react";
import { Text, View } from "react-native";

const EMPTY_MESSAGES = [
  "게시글이 없어요",
  "좋아요한 게시글이 없어요",
  "저장한 게시글이 없어요",
];

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

// ─── Profile header ──────────────────────────────────────────

const MyProfileHeaderContent = () => {
  const { data: userData } = useUserProfileQuery();
  const { data: myPostsData } = useMyPostsQuery();
  const postCount = myPostsData.pages.flat().length;

  return (
    <ProfileHeader
      imageUrl={userData.profileImageUrl}
      name={userData.nickname}
      subtitle={userData.isLivingWithCat ? "고양이 집사" : "랜선 집사"}
      stats={[
        { label: "게시글", value: postCount },
        { label: "팔로워", value: userData.followerCount, href: "/user/follower" as const },
        { label: "팔로잉", value: userData.followingCount, href: "/user/following" as const },
      ]}
      actions={<ProfileActions />}
    >
      <Suspense fallback={null}>
        <MyCatListSection />
      </Suspense>
      <View className="h-6" />
    </ProfileHeader>
  );
};

// ─── Post grid ───────────────────────────────────────────────

const MypagePostGrid = ({
  activeTab,
  onTabChange,
}: {
  activeTab: number;
  onTabChange: (i: number) => void;
}) => {
  const myPostsQuery = useMyPostsQuery();
  const likedQuery = useMyLikedPostsQuery();
  const bookmarkedQuery = useMyBookmarkedPostsQuery();

  const queries = [myPostsQuery, likedQuery, bookmarkedQuery];
  const activeQuery = queries[activeTab];
  const posts = activeQuery.data.pages.flat();

  return (
    <ProfilePostGrid
      tabBar={<TabIconBar activeIndex={activeTab} onChange={onTabChange} />}
      posts={posts}
      isFetchingNextPage={activeQuery.isFetchingNextPage}
      hasNextPage={activeQuery.hasNextPage}
      fetchNextPage={activeQuery.fetchNextPage}
      emptyMessage={EMPTY_MESSAGES[activeTab]}
    />
  );
};

// ─── Page content ────────────────────────────────────────────

const MypageContent = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <Suspense fallback={<ProfileHeaderSkeleton />}>
        <MyProfileHeaderContent />
      </Suspense>
      <Suspense fallback={<PostGridSkeleton />}>
        <MypagePostGrid activeTab={activeTab} onTabChange={setActiveTab} />
      </Suspense>
    </>
  );
};

// ─── Page ────────────────────────────────────────────────────

const Mypage = () => {
  const { colors } = useColors();
  const defaultOptions = useDefaultStackScreenOptions();

  return (
    <>
      <Stack.Screen
        options={{
          ...defaultOptions,
          title: "마이페이지",
          headerLeft: undefined,
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
        <MypageContent />
      </View>
    </>
  );
};

export default Mypage;
