import { ImageUploadUrl } from "@/api/domains/common/type";

export interface Post {
  id: string;
  content: string | null;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  catId: string | null;
  author: Author;
  cat: Cat | null;
  images: PostImage[];
  isLikedByMe: boolean;
  isBookmarkedByMe: boolean;
}

export interface Author {
  id: string;
  nickname: string;
  profileImageUrl: string | null;
}

export interface Cat {
  id: string;
  name: string;
  gender: "FEMALE" | "MALE" | "UNKNOWN";
  profileImageUrl: string | null;
  birthDate: string | null;
  breed: string | null;
  type: number | null;
  createdAt: string;
  butlerId: string;
}

export interface PostImage {
  id: string;
  url: string;
  order: number;
  postId: string;
}

export interface GetFeedParams {
  take?: number;
  cursor?: string;
}

export type FeedResponse = Post[];

export interface CreatePostRequest {
  catId?: string | null;
  content?: string | null;
  imageUrls?: string[] | null;
}

export type CreatePostResponse = Post;

export interface UpdatePostRequest {
  content?: string;
  imageUrls?: string[];
}

export type UpdatePostResponse = Post;

export interface PresignedUploadItem extends ImageUploadUrl {
  key: string;
}

export interface GetPostImageUploadUrlResponse {
  uploads: PresignedUploadItem[];
}
