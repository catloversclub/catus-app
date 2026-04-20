import { useMyPostsQuery } from "@/api/domains/post/queries";
import { useUserProfileQuery } from "@/api/domains/user/queries";
import ProfileImage from "@/components/user/profile-image";
import { Link } from "expo-router";
import { Suspense } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

export const ProfileInfo = () => {
  return (
    <Suspense fallback={<ActivityIndicator />}>
      <ProfileInfoContent />
    </Suspense>
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
