import { Appearance, Personality } from "@/api/domains/attribute/types";

interface User {
  id: string;
  kakaoId: string | null;
  googleId: string | null;
  appleId: string | null;
  isLivingWithCat: boolean;
  hasAgreedToTerms: boolean;
  createdAt: string;
  phone: string | null;
  nickname: string;
  profileImageUrl: string | null;
  followerCount: number;
  followingCount: number;
  isFollowing: boolean;
  favoriteAppearances: Appearance[];
  favoritePersonalities: Personality[];
}

type CreateUserRequest = Pick<User, "nickname" | "hasAgreedToTerms"> & {
  favoriteAppearances?: number[];
  favoritePersonalities?: number[];
};

type UpdateUserRequest = Partial<
  Omit<User, "favoriteAppearances" | "favoritePersonalities">
> & {
  favoriteAppearances?: number[];
  favoritePersonalities?: number[];
};

type GetUserProfileResponse = Omit<User, "isFollowing">;

type GetUserByIdResponse = Pick<
  User,
  | "followerCount"
  | "followingCount"
  | "nickname"
  | "profileImageUrl"
  | "isFollowing"
>;

type UserProfile = Omit<
  User,
  "id" | "kakaoId" | "googleId" | "appleId" | "createdAt" | "isFollowing"
>;

interface FollowUser {
  id: string;
  nickname: string;
  profileImageUrl: string | null;
  isFollowedByMe: boolean;
  cursor: number;
}

interface BlockedUser {
  id: string;
  nickname: string;
  profileImageUrl: string | null;
  cursor: number;
}

interface GetFollowListParams {
  cursor?: number;
  take?: number;
}

type GetFollowersResponse = FollowUser[];
type GetFollowingsResponse = FollowUser[];
type GetBlocksResponse = BlockedUser[];

export {
  BlockedUser,
  CreateUserRequest,
  FollowUser,
  GetBlocksResponse,
  GetFollowersResponse,
  GetFollowingsResponse,
  GetFollowListParams,
  GetUserByIdResponse,
  GetUserProfileResponse,
  UpdateUserRequest,
  User,
  UserProfile,
};
