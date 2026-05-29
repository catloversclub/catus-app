import { STORAGE_BASE_URL } from "@/constants/api";
import { ImageUploadUrl } from "@/api/domains/common/type";

const uploadImage = async ({
  fields,
  fileUri,
}: {
  fields: ImageUploadUrl["fields"];
  fileUri: string;
}) => {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    formData.append(key, value);
  });

  formData.append("file", {
    uri: fileUri,
    type: fields["Content-Type"],
    name: fileUri.split("/").pop() || "profile.png",
  } as unknown as Blob);

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
