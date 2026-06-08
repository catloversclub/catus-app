import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { useEffect } from "react";
import { AppState } from "react-native";

const useMediaPermissions = () => {
  const [galleryPermission, requestGalleryPermission, getGalleryPermission] =
    MediaLibrary.usePermissions();
  const [cameraPermission, requestCameraPermission, getCameraPermission] =
    ImagePicker.useCameraPermissions();

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state !== "active") return;
      getGalleryPermission();
      getCameraPermission();
    });

    return () => subscription.remove();
  }, [getCameraPermission, getGalleryPermission]);

  return {
    galleryPermission,
    cameraPermission,
    requestGalleryPermission,
    requestCameraPermission,
    getGalleryPermission,
    getCameraPermission,
    isGalleryPermissionGranted: galleryPermission?.status === "granted",
    isGalleryPermissionDenied: galleryPermission?.status === "denied",
    isCameraPermissionGranted: cameraPermission?.status === "granted",
    isCameraPermissionDenied: cameraPermission?.status === "denied",
  };
};

export { useMediaPermissions };
