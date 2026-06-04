import CatProfileImage from "@/components/cat/profile-image";
import UserProfileImage from "@/components/user/profile-image";
import { Link } from "expo-router";
import { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

interface PostProfileInfoBaseProps {
  image: ReactNode;
  name: string;
  href: string | null;
  subtitle?: string;
}

const PostProfileInfoBase = ({
  image,
  name,
  href,
  subtitle,
}: PostProfileInfoBaseProps) => (
  <View className="flex-row items-center gap-3">
    {image}
    <View>
      {href ? (
        <Link href={href as never} asChild>
          <Pressable className="active:opacity-60">
            <Text className="typo-body3 text-semantic-text-primary">{name}</Text>
          </Pressable>
        </Link>
      ) : (
        <Text className="typo-body3 text-semantic-text-primary">{name}</Text>
      )}
      {subtitle && (
        <Text className="typo-label1 text-semantic-text-secondary">
          {subtitle}
        </Text>
      )}
    </View>
  </View>
);

// ─────────────────────────────────────────────────────────────────────────────

interface CatPostProfileInfoProps {
  imageUrl: string | null;
  catId?: string | null;
  name: string;
  subtitle?: string;
}

const CatPostProfileInfo = ({
  imageUrl,
  catId,
  name,
  subtitle,
}: CatPostProfileInfoProps) => (
  <PostProfileInfoBase
    image={<CatProfileImage imageUrl={imageUrl} catId={catId ?? undefined} size="sm" />}
    name={name}
    href={catId ? `/cat/${catId}` : null}
    subtitle={subtitle}
  />
);

// ─────────────────────────────────────────────────────────────────────────────

interface UserPostProfileInfoProps {
  imageUrl: string | null;
  userId?: string | null;
  name: string;
  subtitle?: string;
}

const UserPostProfileInfo = ({
  imageUrl,
  userId,
  name,
  subtitle,
}: UserPostProfileInfoProps) => (
  <PostProfileInfoBase
    image={<UserProfileImage imageUrl={imageUrl} userId={userId ?? undefined} size="sm" />}
    name={name}
    href={userId ? `/user/${userId}` : null}
    subtitle={subtitle}
  />
);

export { CatPostProfileInfo, UserPostProfileInfo };
