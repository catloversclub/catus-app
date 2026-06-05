import AvatarDark from "@/assets/images/avatar/user-dark.png";
import AvatarLight from "@/assets/images/avatar/user-light.png";
import { PROFILE_SIZE } from "@/constants/user";
import { useColors } from "@/hooks/use-colors";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { memo, ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

interface FeedProfileImageProps {
  imageUrl: string | null;
  alt: string;
}

const FeedProfileImage = memo(({ imageUrl, alt }: FeedProfileImageProps) => {
  const { scheme } = useColors();
  const defaultAvatar = scheme === "dark" ? AvatarDark : AvatarLight;
  const size = PROFILE_SIZE.sm;

  return (
    <Image
      source={imageUrl ? { uri: imageUrl } : defaultAvatar}
      placeholder={defaultAvatar}
      style={{ width: size, height: size, borderRadius: size }}
      contentFit="cover"
      cachePolicy="memory-disk"
      alt={alt}
    />
  );
});

FeedProfileImage.displayName = "FeedProfileImage";

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
    image={<FeedProfileImage imageUrl={imageUrl} alt={`${catId ?? "Cat"} profile`} />}
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
    image={<FeedProfileImage imageUrl={imageUrl} alt={`${userId ?? "User"} profile`} />}
    name={name}
    href={userId ? `/user/${userId}` : null}
    subtitle={subtitle}
  />
);

export { CatPostProfileInfo, UserPostProfileInfo };
