import Button from "@/components/common/button";
import ImagePickerGrid from "@/components/media/image-picker-grid";
import MediaPermissionModals from "@/components/modal/media-permission-modals";
import { useMediaPermissions } from "@/hooks/use-media-permissions";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const { bottom } = useSafeAreaInsets();
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
  const [assets, setAssets] = useState<MediaLibrary.Asset[]>([]);
  const [endCursor, setEndCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showCameraPermissionModal, setShowCameraPermissionModal] =
    useState(false);
  const loadingRef = useRef(false);
  const assetsById = useMemo(
    () => new Map(assets.map((asset) => [asset.id, asset])),
    [assets],
  );

  const loadPhotos = useCallback(async (cursor?: string) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    try {
      const result = await MediaLibrary.getAssetsAsync({
        first: 60,
        mediaType: MediaLibrary.MediaType.photo,
        after: cursor,
      });
      setAssets((prev) =>
        cursor ? [...prev, ...result.assets] : result.assets,
      );
      setEndCursor(result.endCursor);
      setHasMore(result.hasNextPage);
    } finally {
      loadingRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (galleryPermission?.status === "granted") {
      loadPhotos();
    }
  }, [galleryPermission?.status, loadPhotos]);

  useEffect(() => {
    if (cameraPermission?.status === "granted") {
      setShowCameraPermissionModal(false);
    }
  }, [cameraPermission?.status]);

  const toggleSelection = (assetId: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(assetId)) return prev.filter((id) => id !== assetId);
      if (selectionLimit <= 1) return [assetId];
      if (prev.length >= selectionLimit) return prev;
      return [...prev, assetId];
    });
  };

  const handleCameraPress = async () => {
    if (cameraPermission?.status !== "granted") {
      setShowCameraPermissionModal(true);
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 1,
    });
    if (result.canceled) return;
    const uri = result.assets[0]?.uri;
    if (uri) onConfirm([uri]);
  };

  const handleConfirm = async () => {
    if (selectedIds.length === 0) return;
    const selectedAssets = selectedIds.flatMap((id) => {
      const asset = assetsById.get(id);
      return asset ? [asset] : [];
    });
    const infos = await Promise.all(
      selectedAssets.map((asset) => MediaLibrary.getAssetInfoAsync(asset)),
    );
    const uris = infos
      .map((info) => info.localUri ?? info.uri)
      .filter(Boolean) as string[];
    onConfirm(uris);
  };

  const handleRequestCameraPermission = async () => {
    const result = await requestCameraPermission();
    if (result.status === "granted") {
      setShowCameraPermissionModal(false);
    }
  };
  const isGalleryPermissionLoaded = galleryPermission !== null;

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

            <View
              className="border-t border-semantic-border-primary bg-semantic-bg-primary px-3 pt-3"
              style={{
                paddingBottom: Math.max(bottom, 12) + 12,
              }}
            >
              <Button
                button={{
                  label: confirmLabel,
                  onPress: handleConfirm,
                  disabled: selectedIds.length === 0,
                  size: "lg",
                }}
              />
            </View>
          </>
        ) : null}
      </View>

      <MediaPermissionModals
        gallery={{
          visible: isGalleryPermissionLoaded && !isGalleryPermissionGranted,
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
