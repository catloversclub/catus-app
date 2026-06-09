import { STORAGE_BASE_URL } from "@/constants/api";
import { ImageUploadUrl } from "@/api/domains/common/type";
import * as MediaLibrary from "expo-media-library";

const PHOTO_LIBRARY_URI_PATTERN = /^(ph-upload|ph):\/\//;

const getUploadableFileUri = async (fileUri: string) => {
  if (!PHOTO_LIBRARY_URI_PATTERN.test(fileUri)) return fileUri;

  const assetId = fileUri.replace(PHOTO_LIBRARY_URI_PATTERN, "");
  const assetInfo = await MediaLibrary.getAssetInfoAsync(assetId);

  return assetInfo.localUri ?? assetInfo.uri;
};

const uploadImage = async ({
  fields,
  fileUri,
}: {
  fields: ImageUploadUrl["fields"];
  fileUri: string;
}) => {
  const uploadableFileUri = await getUploadableFileUri(fileUri);
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    formData.append(key, value);
  });

  formData.append("file", {
    uri: uploadableFileUri,
    type: fields["Content-Type"],
    name: uploadableFileUri.split("/").pop() ?? "profile.png",
  });

  const response = await fetch(STORAGE_BASE_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Image upload failed: ${response.status}`);
  }

  return response;
};

export { uploadImage };
