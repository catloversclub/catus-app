import BaseBottomSheet from "@/components/bottom-sheet/base-bottom-sheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";

import AlbumIcon from "@/assets/icons/album.svg";
import CameraIcon from "@/assets/icons/camera.svg";
import ActionPressable from "@/components/common/action-pressable";
import ImagePickerModal from "@/components/media/image-picker-modal";
import MediaPermissionModals from "@/components/modal/media-permission-modals";
import { useColors } from "@/hooks/use-colors";
import { useMediaPermissions } from "@/hooks/use-media-permissions";
import * as ImagePicker from "expo-image-picker";

interface SelectImageSheetProps {
  SelectImageSheetModalRef: React.RefObject<BottomSheetModal | null>;
  handleIsLoading: (isLoading: boolean) => void;
  handleImageUriChange: (uri: string | null) => void;
}

const SelectImageSheet = ({
  SelectImageSheetModalRef,
  handleIsLoading,
  handleImageUriChange,
}: SelectImageSheetProps) => {
  const { colors } = useColors();
  const shouldOpenGalleryPickerRef = useRef(false);
  const [pendingSource, setPendingSource] = useState<"camera" | null>(null);
  const [showGalleryPicker, setShowGalleryPicker] = useState(false);
  const {
    requestCameraPermission,
    isCameraPermissionGranted,
    isCameraPermissionDenied,
  } = useMediaPermissions();

  const handleTakePhoto = useCallback(async () => {
    setPendingSource(null);
    SelectImageSheetModalRef.current?.dismiss();
    handleIsLoading(true);

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 1,
    });

    handleIsLoading(false);
    if (!result.canceled) handleImageUriChange(result.assets[0]?.uri ?? null);
  }, [SelectImageSheetModalRef, handleImageUriChange, handleIsLoading]);

  const handlePermissionRequired = () => {
    SelectImageSheetModalRef.current?.dismiss();
    setPendingSource("camera");
  };

  const handleCameraPress = () => {
    if (!isCameraPermissionGranted) {
      handlePermissionRequired();
      return;
    }

    handleTakePhoto();
  };

  const handleGalleryPress = () => {
    shouldOpenGalleryPickerRef.current = true;
    SelectImageSheetModalRef.current?.dismiss();
  };

  const handleSheetDismiss = () => {
    if (shouldOpenGalleryPickerRef.current) {
      shouldOpenGalleryPickerRef.current = false;
      setShowGalleryPicker(true);
    }
  };

  const handleRequestCameraPermission = async () => {
    const result = await requestCameraPermission();
    if (result.status === "granted") {
      handleTakePhoto();
    }
  };

  useEffect(() => {
    if (pendingSource === "camera" && isCameraPermissionGranted) {
      handleTakePhoto();
    }
  }, [handleTakePhoto, isCameraPermissionGranted, pendingSource]);

  const handlePermissionModalClose = () => {
    setPendingSource(null);
  };

  const handleGalleryConfirm = (uris: string[]) => {
    setShowGalleryPicker(false);
    handleImageUriChange(uris[0] ?? null);
  };

  const SELECT_IMAGE_SHEET_ITEMS = [
    { Icon: CameraIcon, label: "카메라로 촬영", action: handleCameraPress },
    {
      Icon: AlbumIcon,
      label: "앨범에서 사진 업로드",
      action: handleGalleryPress,
    },
  ] as const;

  return (
    <>
      <BaseBottomSheet
        BaseBottomSheetModalRef={SelectImageSheetModalRef}
        onDismiss={handleSheetDismiss}
      >
        <View className="flex-1 flex-col items-center justify-center pb-16">
          {SELECT_IMAGE_SHEET_ITEMS.map(({ Icon, label, action }) => (
            <ActionPressable
              key={label}
              onPress={action}
              className="flex-row gap-1.5 py-[14px] items-center justify-center"
            >
              <Icon height={20} width={20} color={colors.icon.secondary} />
              <Text className="typo-body1 text-semantic-text-primary">
                {label}
              </Text>
            </ActionPressable>
          ))}
        </View>
      </BaseBottomSheet>
      <MediaPermissionModals
        camera={{
          visible: pendingSource === "camera",
          isDenied: isCameraPermissionDenied,
          onRequestPermission: handleRequestCameraPermission,
          onClose: handlePermissionModalClose,
        }}
      />
      <ImagePickerModal
        visible={showGalleryPicker}
        selectionLimit={1}
        confirmLabel="선택 완료"
        onConfirm={handleGalleryConfirm}
        onClose={() => setShowGalleryPicker(false)}
      />
    </>
  );
};

export default SelectImageSheet;
