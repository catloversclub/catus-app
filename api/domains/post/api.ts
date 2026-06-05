import { apiClient } from "@/api/client";

import { POST_PAGINATION } from "@/constants/posts";
import {
  CreatePostRequest,
  CreatePostResponse,
  FeedResponse,
  GetFeedParams,
  GetPostImageUploadUrlResponse,
  Post,
  UpdatePostRequest,
  UpdatePostResponse,
} from "./types";

const BASE_URL = "/post";

const POST_ENDPOINTS = {
  BASE: BASE_URL,
  DETAIL: (postId: string) => `${BASE_URL}/${postId}`,
  CAT_POSTS: (catId: string) => `/cat/${catId}/post`,
  USER_POSTS: (userId: string) => `/user/${userId}/post`,
  MY_POSTS: `${BASE_URL}/my`,
  MY_BOOKMARKED: `${BASE_URL}/bookmark/my`,
  MY_LIKED: `${BASE_URL}/liked/my`,
  FEED: `${BASE_URL}/feed`,
  DAILY_POPULAR: `${BASE_URL}/feed/daily-popular`,
  LIKE: (postId: string) => `${BASE_URL}/${postId}/like`,
  BOOKMARK: (postId: string) => `${BASE_URL}/${postId}/bookmark`,
  REPORT: (postId: string) => `${BASE_URL}/${postId}/report`,
  IMAGE_UPLOAD_URL: `${BASE_URL}/image/upload-url`,
} as const;

export const createPost = async (
  payload: CreatePostRequest,
): Promise<CreatePostResponse> => {
  const { data } = await apiClient.post<CreatePostResponse>(
    POST_ENDPOINTS.BASE,
    payload,
  );
  return data;
};

export const updatePost = async (
  postId: string,
  payload: UpdatePostRequest,
): Promise<UpdatePostResponse> => {
  const { data } = await apiClient.patch<UpdatePostResponse>(
    POST_ENDPOINTS.DETAIL(postId),
    payload,
  );
  return data;
};

export const deletePost = async (postId: string): Promise<void> => {
  await apiClient.delete(POST_ENDPOINTS.DETAIL(postId));
};

export const getPostById = async (postId: string): Promise<Post> => {
  const { data } = await apiClient.get<Post>(POST_ENDPOINTS.DETAIL(postId));
  return data;
};

export const getCatPosts = async (
  catId: string,
  params: GetFeedParams = {},
): Promise<FeedResponse> => {
  const { data } = await apiClient.get<FeedResponse>(
    POST_ENDPOINTS.CAT_POSTS(catId),
    { params },
  );
  return data;
};

export const getUserPosts = async (
  userId: string,
  params: GetFeedParams = {},
): Promise<FeedResponse> => {
  const { data } = await apiClient.get<FeedResponse>(
    POST_ENDPOINTS.USER_POSTS(userId),
    { params },
  );
  return data;
};

export const getMyPosts = async (
  params: GetFeedParams = {},
): Promise<FeedResponse> => {
  const { data } = await apiClient.get<FeedResponse>(POST_ENDPOINTS.MY_POSTS, {
    params,
  });
  return data;
};

export const getMyBookmarkedPosts = async (
  params: GetFeedParams = {},
): Promise<FeedResponse> => {
  const { data } = await apiClient.get<FeedResponse>(
    POST_ENDPOINTS.MY_BOOKMARKED,
    { params },
  );
  return data;
};

export const getMyLikedPosts = async (
  params: GetFeedParams = {},
): Promise<FeedResponse> => {
  const { data } = await apiClient.get<FeedResponse>(POST_ENDPOINTS.MY_LIKED, {
    params,
  });
  return data;
};

export const getFollowingFeed = async ({
  take = POST_PAGINATION.DEFAULT_TAKE,
  cursor,
}: GetFeedParams = {}): Promise<FeedResponse> => {
  const { data } = await apiClient.get<FeedResponse>(POST_ENDPOINTS.FEED, {
    params: { type: "following", take, cursor },
  });
  return data;
};

export const getRecommendedFeed = async ({
  take = POST_PAGINATION.DEFAULT_TAKE,
  cursor,
}: GetFeedParams = {}): Promise<FeedResponse> => {
  const { data } = await apiClient.get<FeedResponse>(POST_ENDPOINTS.FEED, {
    params: { type: "recommended", take, cursor },
  });
  return data;
};

export const getDailyPopularPosts = async (
  take = 10,
): Promise<FeedResponse> => {
  const { data } = await apiClient.get<FeedResponse>(
    POST_ENDPOINTS.DAILY_POPULAR,
    { params: { take } },
  );
  return data;
};

export const likePost = async (postId: string): Promise<void> => {
  await apiClient.post(POST_ENDPOINTS.LIKE(postId));
};

export const unlikePost = async (postId: string): Promise<void> => {
  await apiClient.delete(POST_ENDPOINTS.LIKE(postId));
};

export const bookmarkPost = async (postId: string): Promise<void> => {
  await apiClient.post(POST_ENDPOINTS.BOOKMARK(postId));
};

export const unbookmarkPost = async (postId: string): Promise<void> => {
  await apiClient.delete(POST_ENDPOINTS.BOOKMARK(postId));
};

export const reportPost = async (
  postId: string,
  payload: { reason: string; description?: string },
): Promise<void> => {
  await apiClient.post(POST_ENDPOINTS.REPORT(postId), payload);
};

export const getPostImageUploadUrl = async (
  count: number,
): Promise<GetPostImageUploadUrlResponse> => {
  const { data } = await apiClient.post<GetPostImageUploadUrlResponse>(
    POST_ENDPOINTS.IMAGE_UPLOAD_URL,
    { count },
  );
  return data;
};
