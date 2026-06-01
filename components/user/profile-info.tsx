import { useMyPostsQuery } from "@/api/domains/post/queries";
import { useUserProfileQuery } from "@/api/domains/user/queries";
import ProfileImage from "@/components/common/profile-image";
import { useColors } from "@/hooks/use-colors";
import { Link } from "expo-router";
import { Skeleton } from "moti/skeleton";
import { Suspense } from "react";
import { Pressable, Text, View } from "react-native";

export const ProfileInfo = () => {
  return (
    <Suspense fallback={<ProfileInfoSkeleton />}>
      <ProfileInfoContent />
    </Suspense>
  );
};

const ProfileInfoSkeleton = () => {
  const { scheme } = useColors();
  const colorMode = scheme === "dark" ? "dark" : "light";
  return (
    <Skeleton.Group show={true}>
      <View className="flex-col items-center">
        <Skeleton colorMode={colorMode} radius="round" height={80} width={80} />
        <View className="mt-3 mb-1">
          <Skeleton colorMode={colorMode} height={22} width={100} radius={4} />
        </View>
        <View className="mb-3">
          <Skeleton colorMode={colorMode} height={16} width={72} radius={4} />
        </View>
        <View className="flex-row mb-6">
          <View className="flex-row gap-1 px-3 py-1.5">
            <Skeleton colorMode={colorMode} height={16} width={60} radius={4} />
          </View>
          <View className="flex-row gap-1 px-3 py-1.5">
            <Skeleton colorMode={colorMode} height={16} width={60} radius={4} />
          </View>
          <View className="flex-row gap-1 px-3 py-1.5">
            <Skeleton colorMode={colorMode} height={16} width={60} radius={4} />
          </View>
        </View>
      </View>
    </Skeleton.Group>
  );
};

const ProfileInfoContent = () => {
  const { data: userData } = useUserProfileQuery();
  const { data: myPostsData } = useMyPostsQuery();
  const name = userData.nickname;
  const isLivingWithCat = userData.isLivingWithCat;
  const followerCount = userData.followerCount;
  const followingCount = userData.followingCount;
  const postCount = myPostsData.pages.flat().length;

  return (
    <View className="flex-col items-center">
      <ProfileImage imageUrl={userData.profileImageUrl} size="lg" />
      <Text className="typo-title3 mb-1 text-semantic-text-primary mt-3">
        {name}
      </Text>
      <Text className="typo-body4 mb-3 text-semantic-text-tertiary">
        {isLivingWithCat ? "고양이 집사" : "랜선 집사"}
      </Text>
      <View className="flex-row mb-6">
        <View className="flex-row gap-1 px-3 py-1.5">
          <Text className="typo-body4 text-semantic-text-tertiary">게시글</Text>
          <Text className="typo-body3 text-semantic-text-secondary">
            {postCount}
          </Text>
        </View>
        <Link href={`/user/follower`} asChild>
          <Pressable>
            <View className="flex-row gap-1 px-3 py-1.5">
              <Text className="typo-body4 text-semantic-text-tertiary">
                팔로워
              </Text>
              <Text className="typo-body3 text-semantic-text-secondary">
                {followerCount}
              </Text>
            </View>
          </Pressable>
        </Link>
        <Link href={`/user/following`} asChild>
          <Pressable>
            <View className="flex-row gap-1 px-3 py-1.5">
              <Text className="typo-body4 text-semantic-text-tertiary">
                팔로잉
              </Text>
              <Text className="typo-body3 text-semantic-text-secondary">
                {followingCount}
              </Text>
            </View>
          </Pressable>
        </Link>
      </View>
    </View>
  );
};
