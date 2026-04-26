import { AttributeItem } from "@/api/domains/attribute/types";

interface Profile {
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
  favoriteAppearances: AttributeItem[];
  favoritePersonalities: AttributeItem[];
}

type GetUserProfileResponse = Omit<Profile, "isFollowing">;

type GetUserByIdResponse = Pick<
  Profile,
  | "followerCount"
  | "followingCount"
  | "nickname"
  | "profileImageUrl"
  | "isFollowing"
>;

export { GetUserByIdResponse, GetUserProfileResponse, Profile };
