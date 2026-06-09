import BottomActionBar from "@/components/layout/bottom-action-bar";
import ImagePickerGrid from "@/components/media/image-picker-grid";
import MediaPermissionModals from "@/components/modal/media-permission-modals";
import { useCameraAction } from "@/hooks/use-camera-action";
import { useGalleryAssets } from "@/hooks/use-gallery-assets";
import { useMediaPermissions } from "@/hooks/use-media-permissions";
import { usePhotoSelection } from "@/hooks/use-photo-selection";
import { useWindowDimensions, View } from "react-native";

interface ImagePickerScreenProps {
  selectionLimit: number;
  confirmLabel: string;
  onConfirm: (uris: string[]) => void;
  onCancel: () => void;
}

const ImagePickerScreen = ({
  selectionLimit,
  confirmLabel,
  onConfirm,
  onCancel,
}: ImagePickerScreenProps) => {
  const { width } = useWindowDimensions();
  const {
    galleryPermission,
    cameraPermission,
    requestGalleryPermission,
    requestCameraPermission,
    isGalleryPermissionGranted,
    isGalleryPermissionDenied,
    isCameraPermissionDenied,
  } = useMediaPermissions();
  const { assets, hasMore, endCursor, loadPhotos } = useGalleryAssets(
    isGalleryPermissionGranted,
  );
  const { selectedIds, toggleSelection, handleConfirm, isResolving } =
    usePhotoSelection({
      selectionLimit,
      assets,
      onConfirm,
    });
  const {
    showCameraPermissionModal,
    setShowCameraPermissionModal,
    handleCameraPress,
    handleRequestCameraPermission,
  } = useCameraAction({ cameraPermission, requestCameraPermission, onConfirm });

  return (
    <>
      <View className="flex-1 bg-semantic-bg-primary">
        {isGalleryPermissionGranted ? (
          <>
            <ImagePickerGrid
              assets={assets}
              width={width}
              selectedIds={selectedIds}
              hasMore={hasMore}
              onCameraPress={handleCameraPress}
              onPhotoPress={toggleSelection}
              onLoadMore={() => loadPhotos(endCursor)}
            />

            <BottomActionBar
              buttons={[
                {
                  label: confirmLabel,
                  onPress: () => {
                    void handleConfirm();
                  },
                  disabled: selectedIds.length === 0 || isResolving,
                  isPending: isResolving,
                },
              ]}
            />
          </>
        ) : null}
      </View>

      <MediaPermissionModals
        gallery={{
          visible: galleryPermission !== null && !isGalleryPermissionGranted,
          isDenied: isGalleryPermissionDenied,
          onRequestPermission: requestGalleryPermission,
          onClose: onCancel,
        }}
        camera={{
          visible: showCameraPermissionModal,
          isDenied: isCameraPermissionDenied,
          onRequestPermission: handleRequestCameraPermission,
          onClose: () => setShowCameraPermissionModal(false),
        }}
      />
    </>
  );
};

export default ImagePickerScreen;
