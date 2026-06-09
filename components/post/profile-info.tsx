import AvatarDark from "@/assets/images/avatar/user-dark.png";
import AvatarLight from "@/assets/images/avatar/user-light.png";
import { PROFILE_SIZE } from "@/constants/user";
import { useColors } from "@/hooks/use-colors";
import { Image } from "expo-image";
import { Link, type Href } from "expo-router";
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
  href: Href;
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
      <Link href={href} asChild>
        <Pressable className="active:opacity-60">
          <Text className="typo-body3 text-semantic-text-primary">{name}</Text>
        </Pressable>
      </Link>
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
  catId: string;
  name: string;
  subtitle?: string;
}

const CatPostProfileInfo = ({
  imageUrl,
  catId,
  name,
  subtitle,
}: CatPostProfileInfoProps) => {
  const href: Href = { pathname: "/cat/[id]", params: { id: catId } };

  return (
    <PostProfileInfoBase
      image={
        <FeedProfileImage
          imageUrl={imageUrl}
          alt={`${catId} profile`}
        />
      }
      name={name}
      href={href}
      subtitle={subtitle}
    />
  );
};

// ─────────────────────────────────────────────────────────────────────────────

interface UserPostProfileInfoProps {
  imageUrl: string | null;
  userId: string;
  name: string;
  subtitle?: string;
}

const UserPostProfileInfo = ({
  imageUrl,
  userId,
  name,
  subtitle,
}: UserPostProfileInfoProps) => {
  const href: Href = { pathname: "/user/[id]", params: { id: userId } };

  return (
    <PostProfileInfoBase
      image={
        <FeedProfileImage
          imageUrl={imageUrl}
          alt={`${userId} profile`}
        />
      }
      name={name}
      href={href}
      subtitle={subtitle}
    />
  );
};

export { CatPostProfileInfo, UserPostProfileInfo };
