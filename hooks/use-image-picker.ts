import { useErrorStore } from "@/store/error-store";
import * as ImagePicker from "expo-image-picker";

export const useImagePicker = () => {
  const showError = useErrorStore((s) => s.showError);

  const pickImages = async ({
    selectionLimit,
  }: {
    selectionLimit?: number;
  }) => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      showError(
        "카메라 접근이 거부되어 있어요",
        "설정 앱에서 Catus 어플리케이션의 카메라 접근을 허용해주세요",
      );
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: (selectionLimit ?? 1) > 1,
      selectionLimit,
    });

    if (result.canceled) return null;
    return result.assets.map((asset) => asset.uri);
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      showError(
        "카메라 접근이 거부되어 있어요",
        "설정 앱에서 접근을 허용해주세요",
      );
      return null;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 1,
    });

    if (result.canceled) return null;
    return result.assets.map((asset) => asset.uri);
  };

  return { pickImages, takePhoto };
};
