import ProfileImage from "@/components/common/profile-image";
import { Text } from "@/components/ui/text";
import { Link } from "expo-router";
import { Pressable, View } from "react-native";

interface CommentProfileInfoProps {
  imageUrl: string | null;
  userId?: string | null;
  name: string;
  content: string;
  createdAtLabel: string;
}

const CommentProfileInfo = ({
  imageUrl,
  userId,
  name,
  content,
  createdAtLabel,
}: CommentProfileInfoProps) => {
  const href = userId ? `/user/${userId}` : null;

  return (
    <View className="flex-row flex-1 items-start gap-3">
      <ProfileImage
        imageUrl={imageUrl}
        size="sm"
        href={href ?? undefined}
        alt={`${userId ?? "User"} profile`}
      />
      <View className="flex-1">
        {href ? (
          <Link href={href as never} asChild>
            <Pressable className="self-start active:opacity-60">
              <Text className="typo-body3 text-semantic-text-primary">
                {name}
              </Text>
            </Pressable>
          </Link>
        ) : (
          <Text className="typo-body3 text-semantic-text-primary">{name}</Text>
        )}
        <Text className="typo-body4 mt-1 text-semantic-text-primary">
          {content}
        </Text>
        <Text className="typo-label1 mt-1 text-semantic-text-secondary">
          {createdAtLabel}
        </Text>
      </View>
    </View>
  );
};

export default CommentProfileInfo;
