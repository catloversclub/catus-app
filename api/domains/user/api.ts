import { apiClient } from "@/api/client";
import { ImageUploadUrl } from "@/api/domains/common/type";
import {
  CreateUserRequest,
  CreateUserResponse,
  DeleteUserResponse,
  FollowUserRequest,
  FollowUserResponse,
  GetBlocksResponse,
  GetFollowersResponse,
  GetFollowingsResponse,
  GetFollowListParams,
  GetUserByIdResponse,
  GetUserProfileResponse,
  UpdateUserRequest,
  UpdateUserResponse,
} from "./types";

const BASE_URL = "/user";

const USER_ENDPOINTS = {
  BASE: BASE_URL,
  DETAIL: (userId: string) => `${BASE_URL}/${userId}`,
  ME: `${BASE_URL}/me`,
  FOLLOW: (userId: string) => `${BASE_URL}/${userId}/follow`,
  BLOCK: (userId: string) => `${BASE_URL}/${userId}/block`,
  BLOCKS: `${BASE_URL}/blocks`,
  FOLLOWERS: (userId: string) => `${BASE_URL}/${userId}/followers`,
  FOLLOWINGS: (userId: string) => `${BASE_URL}/${userId}/followings`,
  CHECK_NICKNAME: `${BASE_URL}/check-nickname`,
  IMAGE_UPLOAD_URL: `${BASE_URL}/me/image/upload-url`,
} as const;

export const getUserProfile = async (): Promise<GetUserProfileResponse> => {
  const { data } = await apiClient.get<GetUserProfileResponse>(
    USER_ENDPOINTS.ME,
  );
  return data;
};

export const createUser = async (
  payload: CreateUserRequest,
): Promise<CreateUserResponse> => {
  const { data } = await apiClient.post<CreateUserResponse>(
    USER_ENDPOINTS.BASE,
    payload,
  );
  return data;
};

export const getUserById = async (
  userId: string,
): Promise<GetUserByIdResponse> => {
  const { data } = await apiClient.get<GetUserByIdResponse>(
    USER_ENDPOINTS.DETAIL(userId),
  );
  return data;
};

export const updateUser = async (
  payload: UpdateUserRequest,
): Promise<UpdateUserResponse> => {
  const { data } = await apiClient.patch<UpdateUserResponse>(
    USER_ENDPOINTS.ME,
    payload,
  );
  return data;
};

export const deleteUser = async (): Promise<DeleteUserResponse> => {
  const { data } = await apiClient.delete<DeleteUserResponse>(
    USER_ENDPOINTS.ME,
  );
  return data;
};

export const checkNickname = async (
  nickname: string,
): Promise<{ available: boolean }> => {
  const { data } = await apiClient.get(USER_ENDPOINTS.CHECK_NICKNAME, {
    params: { nickname },
  });
  return data;
};

export const followUser = async ({
  userId,
  catIds,
}: FollowUserRequest): Promise<FollowUserResponse> => {
  const { data } = await apiClient.post<FollowUserResponse>(
    USER_ENDPOINTS.FOLLOW(userId),
    { catIds },
  );
  return data;
};

export const unfollowUser = async ({
  userId,
  catIds,
}: FollowUserRequest): Promise<FollowUserResponse> => {
  const { data } = await apiClient.delete<FollowUserResponse>(
    USER_ENDPOINTS.FOLLOW(userId),
    { data: { catIds } },
  );
  return data;
};

export const blockUser = async (
  userId: string,
): Promise<{ isBlockedByMe: boolean }> => {
  const { data } = await apiClient.post(USER_ENDPOINTS.BLOCK(userId));
  return data;
};

export const unblockUser = async (
  userId: string,
): Promise<{ isBlockedByMe: boolean }> => {
  const { data } = await apiClient.delete(USER_ENDPOINTS.BLOCK(userId));
  return data;
};

export const getBlockedUsers = async (
  params: GetFollowListParams = {},
): Promise<GetBlocksResponse> => {
  const { data } = await apiClient.get<GetBlocksResponse>(
    USER_ENDPOINTS.BLOCKS,
    { params },
  );
  return data;
};

export const getUserFollowers = async (
  userId: string,
  params: GetFollowListParams = {},
): Promise<GetFollowersResponse> => {
  const { data } = await apiClient.get<GetFollowersResponse>(
    USER_ENDPOINTS.FOLLOWERS(userId),
    { params },
  );
  return data;
};

export const getUserFollowings = async (
  userId: string,
  params: GetFollowListParams = {},
): Promise<GetFollowingsResponse> => {
  const { data } = await apiClient.get<GetFollowingsResponse>(
    USER_ENDPOINTS.FOLLOWINGS(userId),
    { params },
  );
  return data;
};

export const getUserProfileImageUploadUrl =
  async (): Promise<ImageUploadUrl> => {
    const { data } = await apiClient.post(USER_ENDPOINTS.IMAGE_UPLOAD_URL, {
      contentType: "image/png",
    });
    return data;
  };
