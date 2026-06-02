import CameraIcon from "@/assets/icons/camera.svg";
import AvatarDark from "@/assets/images/avatar/user-dark.png";
import AvatarLight from "@/assets/images/avatar/user-light.png";
import SelectImageSheet from "@/components/bottom-sheet/select-image-sheet";
import IconButton from "@/components/common/icon-button";
import { PROFILE_SIZE } from "@/constants/user";
import { useColors } from "@/hooks/use-colors";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { useRef, useState } from "react";
import { ActivityIndicator, Pressable, View } from "react-native";

interface ProfileImageProps {
  imageUrl: string | null;
  size: "sm" | "md" | "lg";
  userId?: string;
  catId?: string;
  isUserLink?: boolean;
  isCatLink?: boolean;
  isEditMode?: boolean;
  handleImageUriChange?: (uri: string | null) => void;
}

const ProfileImage = ({
  imageUrl,
  userId,
  catId,
  isUserLink = false,
  isCatLink = false,
  isEditMode = false,
  size,
  handleImageUriChange,
}: ProfileImageProps) => {
  const { colors, scheme } = useColors();

  const defaultAvatar = scheme === "dark" ? AvatarDark : AvatarLight;
  const imageSource = imageUrl ? { uri: imageUrl } : defaultAvatar;
  const sizeValue = PROFILE_SIZE[size];

  const [isLoading, setIsLoading] = useState(false);

  const SelectImageSheetModalRef = useRef<BottomSheetModal>(null);

  const handleSelectImagePress = () => {
    SelectImageSheetModalRef.current?.present();
  };

  const image = (
    <>
      <View style={{ width: sizeValue, height: sizeValue }}>
        <Image
          source={imageSource}
          placeholder={defaultAvatar}
          transition={150}
          style={{
            width: sizeValue,
            height: sizeValue,
            borderRadius: sizeValue,
          }}
          contentFit="cover"
          alt={`${userId ?? "User"} profile`}
        />
        {isEditMode && (
          <IconButton
            onPress={handleSelectImagePress}
            disabled={isLoading}
            className="absolute bottom-0 -right-2 size-11 rounded-full items-center justify-center border border-semantic-border-primary"
            style={{ backgroundColor: colors.bg.secondary }}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.icon.primary} />
            ) : (
              <CameraIcon width={20} height={20} color={colors.icon.primary} />
            )}
          </IconButton>
        )}
      </View>
      {handleImageUriChange && (
        <SelectImageSheet
          SelectImageSheetModalRef={SelectImageSheetModalRef}
          handleIsLoading={setIsLoading}
          handleImageUriChange={handleImageUriChange}
        />
      )}
    </>
  );

  if (isUserLink) {
    return (
      <Link href={`/user/${userId}`} asChild>
        <Pressable className="active:opacity-60">{image}</Pressable>
      </Link>
    );
  }

  if (isCatLink) {
    return (
      <Link href={`/cat/${catId}`} asChild>
        <Pressable className="active:opacity-60">{image}</Pressable>
      </Link>
    );
  }

  return image;
};

export default ProfileImage;
