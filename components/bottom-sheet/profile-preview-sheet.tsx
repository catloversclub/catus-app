import AvatarDark from "@/assets/images/avatar/user-dark.png";
import AvatarLight from "@/assets/images/avatar/user-light.png";
import BaseBottomSheet from "@/components/bottom-sheet/base-bottom-sheet";
import { useColors } from "@/hooks/use-colors";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import { Text, View } from "react-native";

const PREVIEW_IMAGE_SIZE = 120;

interface ProfilePreviewSheetProps {
  sheetRef: React.RefObject<BottomSheetModal | null>;
  imageUrl: string | null;
  name?: string;
}

const ProfilePreviewSheet = ({
  sheetRef,
  imageUrl,
  name,
}: ProfilePreviewSheetProps) => {
  const { scheme } = useColors();
  const defaultAvatar = scheme === "dark" ? AvatarDark : AvatarLight;

  return (
    <BaseBottomSheet BaseBottomSheetModalRef={sheetRef}>
      <View className="items-center pb-12 pt-4 gap-4">
        <Image
          source={imageUrl ? { uri: imageUrl } : defaultAvatar}
          placeholder={defaultAvatar}
          transition={150}
          style={{
            width: PREVIEW_IMAGE_SIZE,
            height: PREVIEW_IMAGE_SIZE,
            borderRadius: PREVIEW_IMAGE_SIZE,
          }}
          contentFit="cover"
          alt={name ?? "profile"}
        />
        {name && (
          <Text className="typo-title2 text-semantic-text-primary">{name}</Text>
        )}
      </View>
    </BaseBottomSheet>
  );
};

export default ProfilePreviewSheet;
