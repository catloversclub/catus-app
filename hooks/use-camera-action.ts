import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

interface UseCameraActionProps {
  cameraPermission: ImagePicker.CameraPermissionResponse | null;
  requestCameraPermission: () => Promise<ImagePicker.CameraPermissionResponse>;
  onConfirm: (uris: string[]) => void;
}

const useCameraAction = ({
  cameraPermission,
  requestCameraPermission,
  onConfirm,
}: UseCameraActionProps) => {
  const [showCameraPermissionModal, setShowCameraPermissionModal] =
    useState(false);

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

  const handleRequestCameraPermission = async () => {
    const result = await requestCameraPermission();
    if (result.status === "granted") {
      setShowCameraPermissionModal(false);
    }
  };

  return {
    showCameraPermissionModal,
    setShowCameraPermissionModal,
    handleCameraPress,
    handleRequestCameraPermission,
  };
};

export { useCameraAction };
