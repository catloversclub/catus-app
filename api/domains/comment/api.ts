import { apiClient } from "@/api/client";

import {
  CommentLikeResponse,
  CreateCommentRequest,
  CreateCommentResponse,
  DeleteCommentResponse,
  GetPostCommentsResponse,
  ReportCommentResponse,
} from "./types";

const BASE_URL = "/comment";

const COMMENT_ENDPOINTS = {
  BY_POST: (postId: string) => `/post/${postId}${BASE_URL}`,
  DETAIL: (commentId: string) => `${BASE_URL}/${commentId}`,
  LIKE: (commentId: string) => `${BASE_URL}/${commentId}/like`,
  REPORT: (commentId: string) => `${BASE_URL}/${commentId}/report`,
} as const;

export const getPostComments = async (
  postId: string,
): Promise<GetPostCommentsResponse> => {
  const { data } = await apiClient.get<GetPostCommentsResponse>(
    COMMENT_ENDPOINTS.BY_POST(postId),
  );
  return data;
};

export const createComment = async (
  postId: string,
  payload: CreateCommentRequest,
): Promise<CreateCommentResponse> => {
  const { data } = await apiClient.post<CreateCommentResponse>(
    COMMENT_ENDPOINTS.BY_POST(postId),
    payload,
  );
  return data;
};

export const deleteComment = async (
  commentId: string,
): Promise<DeleteCommentResponse> => {
  const { data } = await apiClient.delete<DeleteCommentResponse>(
    COMMENT_ENDPOINTS.DETAIL(commentId),
  );
  return data;
};

export const reportComment = async (
  commentId: string,
): Promise<ReportCommentResponse> => {
  const { data } = await apiClient.post<ReportCommentResponse>(
    COMMENT_ENDPOINTS.REPORT(commentId),
  );
  return data;
};

export const likeComment = async (
  commentId: string,
): Promise<CommentLikeResponse> => {
  const { data } = await apiClient.post<CommentLikeResponse>(
    COMMENT_ENDPOINTS.LIKE(commentId),
  );
  return data;
};

export const unlikeComment = async (
  commentId: string,
): Promise<CommentLikeResponse> => {
  const { data } = await apiClient.delete<CommentLikeResponse>(
    COMMENT_ENDPOINTS.LIKE(commentId),
  );
  return data;
};
