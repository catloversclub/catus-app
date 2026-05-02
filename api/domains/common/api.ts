import { storageClient } from "@/api/client";
import { ImageUploadUrl } from "@/api/domains/common/type";

type ReactNativeFile = {
  uri: string;
  type: string;
  name: string;
};

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

  const file: ReactNativeFile = {
    uri: fileUri,
    type: fields["Content-Type"],
    name: fileUri.split("/").pop() || "profile.png",
  };

  formData.append("file", file as unknown as Blob);

  const { data } = await storageClient.post("", formData);
  return data;
};

export { uploadImage };
