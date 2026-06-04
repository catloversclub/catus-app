import UserProfileImage from "@/components/user/profile-image";
import { ProfileIdentity } from "@/components/common/profile-identity";
import { ProfileStat, type ProfileStatItem } from "@/components/common/profile-stat";
import { Skeleton } from "@/components/ui/skeleton";
import { Text, View } from "react-native";

interface UserProfileHeaderProps {
  imageUrl?: string | null;
  name: string;
  subtitle?: string | null;
  stats: ProfileStatItem[];
  actions?: React.ReactNode;
}

const UserProfileHeader = ({
  imageUrl,
  name,
  subtitle,
  stats,
  actions,
}: UserProfileHeaderProps) => (
  <View className="pt-6">
    <View className="flex-col items-center">
      <UserProfileImage imageUrl={imageUrl ?? null} size="lg" />
      <ProfileIdentity name={name} subtitle={subtitle} />
      <View className="flex-row mb-6">
        {stats.map((stat) => (
          <ProfileStat key={stat.label} {...stat} />
        ))}
      </View>
    </View>
    {actions}
  </View>
);

const ProfileHeaderSkeleton = () => (
  <View className="pt-6 flex-col items-center">
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

export { UserProfileHeader, ProfileHeaderSkeleton };
