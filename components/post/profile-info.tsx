import { Post } from "@/api/domains/post/types";
import MoreIcon from "@/assets/icons/more.svg";
import PostCatProfileSheet from "@/components/bottom-sheet/post-cat-profile-sheet";
import ProfileImage from "@/components/cat/profile-image";
import ActionPressable from "@/components/common/action-pressable";
import IconButton from "@/components/common/icon-button";
import { useColors } from "@/hooks/use-colors";
import { presentBottomSheet } from "@/lib/bottom-sheet";
import { formatRelativeTime } from "@/lib/utils";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { type Href } from "expo-router";
import { useRef } from "react";
import { Text, View } from "react-native";

interface PostProfileHeaderProps {
  post: Post;
  onMorePress: () => void;
}

const CAT_PROFILE_IMAGE_SIZE = 36;
const CAT_PROFILE_OVERLAP_OFFSET = CAT_PROFILE_IMAGE_SIZE / 2;

const PostProfileHeader = ({ post, onMorePress }: PostProfileHeaderProps) => {
  const { colors } = useColors();
  const catProfileSheetRef = useRef<BottomSheetModal>(null);
  const primaryCat = post.cats[0];

  if (!primaryCat) return null;

  const catHref: Href = {
    pathname: "/cat/[id]",
    params: { id: primaryCat.id },
  };
  const catNames = post.cats.map((cat) => cat.name).join(", ");
  const hasMultipleCats = post.cats.length > 1;
  const profileGroupWidth =
    CAT_PROFILE_IMAGE_SIZE +
    Math.max(post.cats.length - 1, 0) * CAT_PROFILE_OVERLAP_OFFSET;

  return (
    <>
      <View className="flex-row items-center justify-between">
        <ActionPressable
          className="flex-1 flex-row items-center gap-3 pr-2"
          href={hasMultipleCats ? undefined : catHref}
          onPress={
            hasMultipleCats
              ? () => presentBottomSheet(catProfileSheetRef)
              : undefined
          }
        >
          <View
            className="relative"
            style={{ width: profileGroupWidth, height: CAT_PROFILE_IMAGE_SIZE }}
          >
            {post.cats.map((cat, index) => (
              <View
                key={cat.id}
                className="absolute"
                style={{
                  left: index * CAT_PROFILE_OVERLAP_OFFSET,
                  zIndex: post.cats.length - index,
                }}
              >
                <ProfileImage
                  imageUrl={cat.profileImageUrl}
                  size="sm"
                  isPreviewDisabled
                />
              </View>
            ))}
          </View>
          <View className="flex-1">
            <Text
              className="typo-body3 text-semantic-text-primary"
              numberOfLines={1}
            >
              {catNames}
            </Text>
            <Text className="typo-label1 text-semantic-text-secondary">
              {formatRelativeTime(post.createdAt)}
            </Text>
          </View>
        </ActionPressable>
        <IconButton onPress={onMorePress}>
          <MoreIcon color={colors.icon.primary} />
        </IconButton>
      </View>
      {hasMultipleCats && (
        <PostCatProfileSheet sheetRef={catProfileSheetRef} cats={post.cats} />
      )}
    </>
  );
};

export { PostProfileHeader };
