type ImageUploadUrl = {
  url: string;
  fields: {
    "Content-Type": string;
    bucket: string;
    "X-Amz-Algorithm": string;
    "X-Amz-Credential": string;
    "X-Amz-Date": string;
    key: string;
    Policy: string;
    "X-Amz-Signature": string;
  };
};

export { ImageUploadUrl };
