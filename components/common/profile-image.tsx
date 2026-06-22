import CameraIcon from "@/assets/icons/camera.svg";
import SelectImageSheet from "@/components/bottom-sheet/select-image-sheet";
import IconButton from "@/components/common/icon-button";
import ImagePressable from "@/components/common/image-pressable";
import ProfilePreviewModal from "@/components/common/profile-preview-modal";
import { PROFILE_SIZE } from "@/constants/user";
import { useColors } from "@/hooks/use-colors";
import { presentBottomSheet } from "@/lib/bottom-sheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import { type Href } from "expo-router";
import { useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";

type ProfileImageSize = keyof typeof PROFILE_SIZE;

interface ProfileImageProps {
  imageUrl: string;
  size: ProfileImageSize;
  href?: Href;
  alt?: string;
  isEditMode?: boolean;
  isPreviewDisabled?: boolean;
  hasCustomImage?: boolean;
  handleImageUriChange?: (uri: string | null) => void;
}

const ProfileImage = ({
  imageUrl,
  href,
  alt,
  isEditMode = false,
  isPreviewDisabled = false,
  hasCustomImage = true,
  size,
  handleImageUriChange,
}: ProfileImageProps) => {
  const { colors } = useColors();

  const imageSource = { uri: imageUrl };
  const sizeValue = PROFILE_SIZE[size];

  const [isLoading, setIsLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [previewOrigin, setPreviewOrigin] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const SelectImageSheetModalRef = useRef<BottomSheetModal>(null);
  const imageRef = useRef<View>(null);

  const handleSelectImagePress = () => {
    presentBottomSheet(SelectImageSheetModalRef);
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
        placeholder={imageSource}
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
      hasImage={hasCustomImage}
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
