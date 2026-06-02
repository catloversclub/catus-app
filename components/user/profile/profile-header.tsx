import ProfileImage from "@/components/common/profile-image";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, type Href } from "expo-router";
import { Pressable, Text, View } from "react-native";

type StatItem = {
  label: string;
  value: number;
  href?: Href;
};

interface UserProfileHeaderProps {
  imageUrl?: string | null;
  name: string;
  subtitle?: string | null;
  stats: StatItem[];
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
      <ProfileImage imageUrl={imageUrl ?? null} size="lg" />
      <Text className="typo-title3 mb-1 text-semantic-text-primary mt-3">
        {name}
      </Text>
      {subtitle != null && (
        <Text className="typo-body4 mb-3 text-semantic-text-tertiary">
          {subtitle}
        </Text>
      )}
      <View className="flex-row mb-6">
        {stats.map((stat) =>
          stat.href ? (
            <Link key={stat.label} href={stat.href} asChild>
              <Pressable>
                <View className="flex-row gap-1 px-3 py-1.5">
                  <Text className="typo-body4 text-semantic-text-tertiary">
                    {stat.label}
                  </Text>
                  <Text className="typo-body3 text-semantic-text-secondary">
                    {stat.value}
                  </Text>
                </View>
              </Pressable>
            </Link>
          ) : (
            <View key={stat.label} className="flex-row gap-1 px-3 py-1.5">
              <Text className="typo-body4 text-semantic-text-tertiary">
                {stat.label}
              </Text>
              <Text className="typo-body3 text-semantic-text-secondary">
                {stat.value}
              </Text>
            </View>
          ),
        )}
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
