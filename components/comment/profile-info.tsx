import ProfileImage from "@/components/common/profile-image";
import ActionPressable from "@/components/common/action-pressable";
import { Text } from "@/components/ui/text";
import { type Href } from "expo-router";
import { View } from "react-native";

interface CommentProfileInfoProps {
  imageUrl: string | null;
  userId: string;
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
  const href: Href = { pathname: "/user/[id]", params: { id: userId } };

  return (
    <View className="flex-row flex-1 items-start gap-3">
      <ProfileImage
        imageUrl={imageUrl}
        size="sm"
        href={href}
        alt={`${userId} profile`}
      />
      <View className="flex-1">
        <ActionPressable href={href} className="self-start">
          <Text className="typo-body3 text-semantic-text-primary">{name}</Text>
        </ActionPressable>
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
