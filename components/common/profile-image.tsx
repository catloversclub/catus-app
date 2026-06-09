import CameraIcon from "@/assets/icons/camera.svg";
import AvatarDark from "@/assets/images/avatar/user-dark.png";
import AvatarLight from "@/assets/images/avatar/user-light.png";
import SelectImageSheet from "@/components/bottom-sheet/select-image-sheet";
import IconButton from "@/components/common/icon-button";
import ImagePressable from "@/components/common/image-pressable";
import ProfilePreviewModal from "@/components/common/profile-preview-modal";
import { PROFILE_SIZE } from "@/constants/user";
import { useColors } from "@/hooks/use-colors";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import { type Href } from "expo-router";
import { useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";

type ProfileImageSize = keyof typeof PROFILE_SIZE;

interface ProfileImageProps {
  imageUrl: string | null;
  size: ProfileImageSize;
  href?: Href;
  alt?: string;
  isEditMode?: boolean;
  isPreviewDisabled?: boolean;
  handleImageUriChange?: (uri: string | null) => void;
}

const ProfileImage = ({
  imageUrl,
  href,
  alt,
  isEditMode = false,
  isPreviewDisabled = false,
  size,
  handleImageUriChange,
}: ProfileImageProps) => {
  const { colors, scheme } = useColors();

  const defaultAvatar = scheme === "dark" ? AvatarDark : AvatarLight;
  const imageSource = imageUrl ? { uri: imageUrl } : defaultAvatar;
  const sizeValue = PROFILE_SIZE[size];

  const [isLoading, setIsLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(!!imageUrl);
  const [previewOrigin, setPreviewOrigin] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const SelectImageSheetModalRef = useRef<BottomSheetModal>(null);
  const imageRef = useRef<View>(null);

  const handleSelectImagePress = () => {
    SelectImageSheetModalRef.current?.present();
  };

  const handlePreviewPress = () => {
    imageRef.current?.measureInWindow((x, y, w, h) => {
      if (w > 0) setPreviewOrigin({ x, y, width: w, height: h });
    });
  };

  const imageVisual = (
    <View ref={imageRef} style={{ width: sizeValue, height: sizeValue }}>
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
        alt={alt ?? "profile"}
        onLoad={() => setIsImageLoading(false)}
      />
      {isImageLoading && (
        <View
          style={{
            position: "absolute",
            width: sizeValue,
            height: sizeValue,
            borderRadius: sizeValue,
          }}
          className="bg-accent animate-pulse"
        />
      )}
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
  );

  const selectImageSheet = handleImageUriChange && (
    <SelectImageSheet
      SelectImageSheetModalRef={SelectImageSheetModalRef}
      handleIsLoading={setIsLoading}
      handleImageUriChange={handleImageUriChange}
    />
  );

  if (href) {
    return (
      <ImagePressable href={href}>
        {imageVisual}
        {selectImageSheet}
      </ImagePressable>
    );
  }

  if (!isEditMode && !isPreviewDisabled) {
    return (
      <>
        <ImagePressable onPress={handlePreviewPress}>
          {imageVisual}
        </ImagePressable>
        {selectImageSheet}
        <ProfilePreviewModal
          visible={previewOrigin !== null}
          imageUrl={imageUrl}
          origin={previewOrigin ?? undefined}
          onClose={() => setPreviewOrigin(null)}
        />
      </>
    );
  }

  return (
    <>
      {imageVisual}
      {selectImageSheet}
    </>
  );
};

export type { ProfileImageSize };
export default ProfileImage;
