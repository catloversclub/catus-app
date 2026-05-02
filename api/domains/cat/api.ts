import { apiClient } from "@/api/client";

import { ImageUploadUrl } from "@/api/domains/common/type";
import {
  CreateCatRequest,
  CreateCatResponse,
  GetCatByIdResponse,
  GetMyCatsResponse,
  UpdateCatRequest,
  UpdateCatResponse,
} from "./types";

const BASE_URL = "/cat";

const CAT_ENDPOINTS = {
  BASE: `${BASE_URL}`,
  MY_CATS: `${BASE_URL}/my`,
  DETAIL: (catId: string) => `${BASE_URL}/${catId}`,
  IMAGE_UPLOAD_URL: (catId: string) => `${BASE_URL}/${catId}/image/upload-url`,
} as const;

export const getMyCats = async (): Promise<GetMyCatsResponse> => {
  const { data } = await apiClient.get<GetMyCatsResponse>(
    CAT_ENDPOINTS.MY_CATS,
  );
  return data;
};

export const getCatById = async (
  catId: string,
): Promise<GetCatByIdResponse> => {
  const { data } = await apiClient.get<GetCatByIdResponse>(
    CAT_ENDPOINTS.DETAIL(catId),
  );
  return data;
};

export const createCat = async (
  payload: CreateCatRequest,
): Promise<CreateCatResponse> => {
  const { data } = await apiClient.post<CreateCatResponse>(
    CAT_ENDPOINTS.BASE,
    payload,
  );
  return data;
};

export const updateCat = async (
  catId: string,
  payload: UpdateCatRequest,
): Promise<UpdateCatResponse> => {
  const { data } = await apiClient.patch<UpdateCatResponse>(
    CAT_ENDPOINTS.DETAIL(catId),
    payload,
  );
  return data;
};

export const deleteCat = async (catId: string): Promise<void> => {
  await apiClient.delete(CAT_ENDPOINTS.DETAIL(catId));
};

export const getCatImageUploadUrl = async ({
  catId,
}: {
  catId: string;
}): Promise<ImageUploadUrl> => {
  const { data } = await apiClient.post<ImageUploadUrl>(
    CAT_ENDPOINTS.IMAGE_UPLOAD_URL(catId),
    {
      contentType: "image/png",
    },
  );
  return data;
};
