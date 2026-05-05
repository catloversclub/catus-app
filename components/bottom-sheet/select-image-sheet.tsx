import { BaseBottomSheet } from "@/components/bottom-sheet/base-bottom-sheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React from "react";
import { Pressable, Text, View } from "react-native";

import AlbumIcon from "@/assets/icons/album.svg";
import CameraIcon from "@/assets/icons/camera.svg";
import { useColors } from "@/hooks/use-colors";
import { useImagePicker } from "@/hooks/use-image-picker";
interface SelectImageSheetProps {
  SelectImageSheetModalRef: React.RefObject<BottomSheetModal | null>;
  handleIsLoading: (isLoading: boolean) => void;
  handleImageUriChange: (uri: string | null) => void;
}

export const SelectImageSheet = ({
  SelectImageSheetModalRef,
  handleIsLoading,
  handleImageUriChange,
}: SelectImageSheetProps) => {
  const { colors } = useColors();
  const { pickImages, takePhoto } = useImagePicker();

  const handleSelect = async (action: () => Promise<string[] | null>) => {
    SelectImageSheetModalRef.current?.dismiss();
    handleIsLoading(true);
    const uris = await action();
    handleIsLoading(false);
    if (uris) handleImageUriChange(uris[0]);
  };

  const SELECT_IMAGE_SHEET_ITEMS = [
    { Icon: CameraIcon, label: "카메라로 촬영", action: takePhoto },
    {
      Icon: AlbumIcon,
      label: "앨범에서 사진 업로드",
      action: () => pickImages({ selectionLimit: 1 }),
    },
  ] as const;

  return (
    <BaseBottomSheet BaseBottomSheetModalRef={SelectImageSheetModalRef}>
      <View className="flex-1 flex-col items-center justify-center pb-16">
        {SELECT_IMAGE_SHEET_ITEMS.map(({ Icon, label, action }) => (
          <Pressable
            key={label}
            onPress={() => handleSelect(action)}
            className="flex-row gap-1.5 py-[14px] items-center justify-center active:opacity-60"
          >
            <Icon height={20} width={20} color={colors.icon.secondary} />
            <Text className="typo-body1 text-semantic-text-primary">
              {label}
            </Text>
          </Pressable>
        ))}
      </View>
    </BaseBottomSheet>
  );
};
