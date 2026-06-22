import { ProfileIdentity } from "@/components/common/profile-identity";
import { ProfileStat } from "@/components/common/profile-stat";
import { Skeleton } from "@/components/ui/skeleton";
import UserProfileImage from "@/components/user/profile-image";
import { View } from "react-native";

interface UserProfileHeaderProps {
  userId: string;
  imageUrl?: string | null;
  name: string;
  subtitle?: string | null;
  postsCount: number;
  followerCount: number;
  followingCount: number;
  actions?: React.ReactNode;
}

const UserProfileHeader = ({
  userId,
  imageUrl,
  name,
  subtitle,
  postsCount,
  followerCount,
  followingCount,
  actions,
}: UserProfileHeaderProps) => (
  <View className="py-6 flex-col gap-6">
    <View className="flex-col items-center">
      <UserProfileImage imageUrl={imageUrl ?? null} size="lg" />
      <ProfileIdentity name={name} subtitle={subtitle} />
      <View className="flex-row">
        <ProfileStat label="게시글" value={postsCount} />
        <ProfileStat
          label="팔로워"
          value={followerCount}
          href={{ pathname: "/user/[id]/follower", params: { id: userId } }}
        />
        <ProfileStat
          label="팔로잉"
          value={followingCount}
          href={{ pathname: "/user/[id]/following", params: { id: userId } }}
        />
      </View>
    </View>
    {actions}
  </View>
);

const ProfileHeaderSkeleton = () => (
  <View className="py-6 flex-col items-center">
    <Skeleton className="rounded-full" style={{ width: 80, height: 80 }} />
    <View className="mt-3 mb-1">
      <Skeleton className="rounded" style={{ width: 100, height: 22 }} />
    </View>
    <View className="mb-3">
      <Skeleton className="rounded" style={{ width: 72, height: 16 }} />
    </View>
    <View className="flex-row mb-6">
      {[0, 1, 2].map((i) => (
        <View key={i} className="flex-row gap-1 px-3 py-1.5">
          <Skeleton className="rounded" style={{ width: 60, height: 16 }} />
        </View>
      ))}
    </View>
  </View>
);

export { ProfileHeaderSkeleton, UserProfileHeader };
