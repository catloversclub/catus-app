import { Appearance, Personality } from "@/api/domains/attribute/types";

interface User {
  id: string;
  kakaoId: string | null;
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

type UserRecord = Omit<
  User,
  "isFollowing" | "favoriteAppearances" | "favoritePersonalities"
>;

type CreateUserRequest = Pick<User, "nickname"> &
  Partial<
    Pick<
      User,
      "isLivingWithCat" | "hasAgreedToTerms" | "phone" | "profileImageUrl"
    >
  > & {
    favoriteAppearances?: number[];
    favoritePersonalities?: number[];
  };

type UpdateUserRequest = Partial<
  Omit<
    User,
    | "id"
    | "kakaoId"
    | "createdAt"
    | "followerCount"
    | "followingCount"
    | "isFollowing"
    | "favoriteAppearances"
    | "favoritePersonalities"
  >
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

type FollowUserRequest = {
  userId: string;
  catIds: string[];
};

type FollowUserResponse = {
  follower: Pick<User, "id" | "followingCount">;
  target: Pick<User, "id" | "followerCount">;
  isFollowing: boolean;
  followedCatIds: string[];
};

type CreateUserResponse = UserRecord;
type UpdateUserResponse = UserRecord;
type DeleteUserResponse = UserRecord;

type UserProfile = Omit<User, "id" | "kakaoId" | "createdAt" | "isFollowing">;

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
  CreateUserResponse,
  DeleteUserResponse,
  FollowUserRequest,
  FollowUserResponse,
  FollowUser,
  GetBlocksResponse,
  GetFollowersResponse,
  GetFollowingsResponse,
  GetFollowListParams,
  GetUserByIdResponse,
  GetUserProfileResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  User,
  UserRecord,
  UserProfile,
};
