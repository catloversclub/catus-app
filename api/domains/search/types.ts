import { Post } from "@/api/domains/post/types";

export type SearchType = "post" | "profile";

export interface SearchParams {
  type: SearchType;
  query: string;
  cursor?: string;
  userCursor?: string;
  catCursor?: string;
  take?: number;
}

export interface SearchAutocompleteParams {
  query: string;
}

export interface SearchUserItem {
  id: string;
  nickname: string;
  profileImageUrl: string | null;
  followerCount: number;
  followingCount: number;
}

export interface SearchCatItem {
  id: string;
  name: string;
  breed: string | null;
  profileImageUrl: string | null;
  butler: {
    id: string;
    nickname: string;
    profileImageUrl: string | null;
  };
}

export interface SearchPostResult {
  type: "post";
  posts: Post[];
}

export interface SearchProfileResult {
  type: "profile";
  users: SearchUserItem[];
  cats: SearchCatItem[];
}

export type SearchResult = SearchPostResult | SearchProfileResult;

export interface AutocompleteProfileItem {
  profileName: string;
  profileImageUrl: string | null;
}

export interface AutocompleteResult {
  profile: {
    users: AutocompleteProfileItem[];
    cats: AutocompleteProfileItem[];
  };
  post: {
    keywords: string[];
  };
}
