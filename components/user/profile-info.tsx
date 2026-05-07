import { useMyPostsQuery } from "@/api/domains/post/queries";
import { useUserProfileQuery } from "@/api/domains/user/queries";
import ProfileImage from "@/components/common/profile-image";
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
  return (
    <Skeleton.Group show={true}>
      <View className="flex-col items-center">
        {/* ProfileImage size="lg" 에 맞춤 */}
        <Skeleton colorMode="light" radius="round" height={80} width={80} />

        {/* nickname */}
        <View className="mt-3 mb-1">
          <Skeleton colorMode="light" height={22} width={100} radius={4} />
        </View>

        {/* 고양이 집사 / 랜선 집사 */}
        <View className="mb-3">
          <Skeleton colorMode="light" height={16} width={72} radius={4} />
        </View>

        {/* 게시글 / 팔로워 / 팔로잉 */}
        <View className="flex-row mb-6">
          <View className="flex-row gap-1 px-3 py-1.5">
            <Skeleton colorMode="light" height={16} width={60} radius={4} />
          </View>
          <View className="flex-row gap-1 px-3 py-1.5">
            <Skeleton colorMode="light" height={16} width={60} radius={4} />
          </View>
          <View className="flex-row gap-1 px-3 py-1.5">
            <Skeleton colorMode="light" height={16} width={60} radius={4} />
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
  const postCount = myPostsData.length;

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
