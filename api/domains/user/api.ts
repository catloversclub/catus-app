import { apiClient } from "@/api/client";
import { ImageUploadUrl } from "@/api/domains/common/type";
import {
  CreateUserRequest,
  GetUserByIdResponse,
  GetUserProfileResponse,
  UpdateUserRequest,
} from "./types"; // 프로젝트에 맞는 타입으로 변경하세요

const BASE_URL = "/user";

const USER_ENDPOINTS = {
  BASE: BASE_URL,
  DETAIL: (userId: string) => `${BASE_URL}/${userId}`,
  ME: `${BASE_URL}/me`,
  FOLLOW: (userId: string) => `${BASE_URL}/${userId}/follow`,
  CHECK_NICKNAME: `${BASE_URL}/check-nickname`, // 쿼리 파라미터로 보낼 것이므로 함수형 대신 문자열로 변경
  IMAGE_UPLOAD_URL: `${BASE_URL}/me/image/upload-url`,
} as const;

// 0. 내 프로필 가져오기 (GET)
export const getUserProfile = async (): Promise<GetUserProfileResponse> => {
  const { data } = await apiClient.get<GetUserProfileResponse>(
    USER_ENDPOINTS.ME,
  );
  return data;
};

// 1. 사용자 생성 (POST)
export const createUser = async (payload: CreateUserRequest) => {
  const { data } = await apiClient.post(USER_ENDPOINTS.BASE, payload);
  return data;
};

// 2. ID로 사용자 받아오기 (GET)
export const getUserById = async (
  userId: string,
): Promise<GetUserByIdResponse> => {
  const { data } = await apiClient.get<GetUserByIdResponse>(
    USER_ENDPOINTS.DETAIL(userId),
  );
  return data;
};

// 3. 사용자 업데이트하기 (PATCH)
export const updateUser = async (payload: UpdateUserRequest) => {
  const { data } = await apiClient.patch(USER_ENDPOINTS.ME, payload);
  return data;
};

// 4. 사용자 삭제 (DELETE)
export const deleteUser = async () => {
  const { data } = await apiClient.delete(USER_ENDPOINTS.ME);
  return data;
};

// 5. 닉네임 중복확인 (GET)
export const checkNickname = async (
  nickname: string,
): Promise<{ available: boolean }> => {
  const { data } = await apiClient.get(USER_ENDPOINTS.CHECK_NICKNAME, {
    params: { nickname },
  });
  return data;
};

// 6. 팔로우하기 (POST)
export const followUser = async (userId: string) => {
  const { data } = await apiClient.post(USER_ENDPOINTS.FOLLOW(userId));
  return data;
};

// 7. 언팔로우하기 (DELETE)
export const unfollowUser = async (userId: string) => {
  const { data } = await apiClient.delete(USER_ENDPOINTS.FOLLOW(userId));
  return data;
};

export const getUserProfileImageUploadUrl =
  async (): Promise<ImageUploadUrl> => {
    const { data } = await apiClient.post(USER_ENDPOINTS.IMAGE_UPLOAD_URL, {
      contentType: "image/png",
    });
    return data;
  };
