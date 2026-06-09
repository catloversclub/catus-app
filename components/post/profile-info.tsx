import { Post } from "@/api/domains/post/types";
import MoreIcon from "@/assets/icons/more.svg";
import ProfileImage from "@/components/cat/profile-image";
import ActionPressable from "@/components/common/action-pressable";
import IconButton from "@/components/common/icon-button";
import { useColors } from "@/hooks/use-colors";
import { formatRelativeTime } from "@/lib/utils";
import { type Href } from "expo-router";
import { Text, View } from "react-native";

interface PostProfileHeaderProps {
  post: Post;
  onMorePress: () => void;
}

const PostProfileHeader = ({ post, onMorePress }: PostProfileHeaderProps) => {
  const { colors } = useColors();
  const primaryCat = post.cats[0];

  if (!primaryCat) return null;

  const catHref: Href = {
    pathname: "/cat/[id]",
    params: { id: primaryCat.id },
  };

  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center gap-3">
        <ProfileImage
          imageUrl={primaryCat.profileImageUrl}
          size="sm"
          catId={primaryCat.id}
        />
        <View>
          <ActionPressable href={catHref}>
            <Text className="typo-body3 text-semantic-text-primary">
              {primaryCat.name}
            </Text>
          </ActionPressable>
          <Text className="typo-label1 text-semantic-text-secondary">
            {formatRelativeTime(post.createdAt)}
          </Text>
        </View>
      </View>
      <IconButton onPress={onMorePress}>
        <MoreIcon color={colors.icon.primary} />
      </IconButton>
    </View>
  );
};

export { PostProfileHeader };
