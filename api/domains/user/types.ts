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
  isFollowing: boolean; // 팔로우 여부 (선택적 필드)
  favoriteAppearances: number[];
  favoritePersonalities: number[];
}

type CreateUserRequest = Pick<User, "nickname" | "hasAgreedToTerms">;

type UpdateUserRequest = Partial<User>;

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

export {
  CreateUserRequest,
  GetUserByIdResponse,
  GetUserProfileResponse,
  UpdateUserRequest,
  User,
  UserProfile,
};
