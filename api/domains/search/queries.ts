import {
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { search, searchAutocomplete } from "./api";
import { SearchType } from "./types";

export const searchKeys = {
  all: ["search"] as const,
  results: (type: SearchType, query: string) =>
    [...searchKeys.all, "results", type, query] as const,
  autocomplete: (query: string) =>
    [...searchKeys.all, "autocomplete", query] as const,
};

const DEFAULT_TAKE = 20;

export const useSearchPostsQuery = (query: string) => {
  return useInfiniteQuery({
    queryKey: searchKeys.results("post", query),
    queryFn: ({ pageParam }) =>
      search({
        type: "post",
        query,
        take: DEFAULT_TAKE,
        cursor: pageParam,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      if (lastPage.type !== "post") return undefined;
      if (lastPage.posts.length < DEFAULT_TAKE) return undefined;
      return lastPage.posts[lastPage.posts.length - 1].id;
    },
    enabled: query.trim().length > 0,
  });
};

export const useSearchProfilesQuery = (query: string) => {
  return useInfiniteQuery({
    queryKey: searchKeys.results("profile", query),
    queryFn: ({ pageParam }) =>
      search({
        type: "profile",
        query,
        take: DEFAULT_TAKE,
        userCursor: pageParam?.userCursor,
        catCursor: pageParam?.catCursor,
      }),
    initialPageParam: undefined as
      | { userCursor?: string; catCursor?: string }
      | undefined,
    getNextPageParam: (lastPage) => {
      if (lastPage.type !== "profile") return undefined;
      const hasMoreUsers = lastPage.users.length >= DEFAULT_TAKE;
      const hasMoreCats = lastPage.cats.length >= DEFAULT_TAKE;
      if (!hasMoreUsers && !hasMoreCats) return undefined;
      return {
        userCursor: hasMoreUsers
          ? lastPage.users[lastPage.users.length - 1].id
          : undefined,
        catCursor: hasMoreCats
          ? lastPage.cats[lastPage.cats.length - 1].id
          : undefined,
      };
    },
    enabled: query.trim().length > 0,
  });
};

export const useSearchAutocompleteQuery = (
  query: string,
  enabled: boolean,
) => {
  return useQuery({
    queryKey: searchKeys.autocomplete(query),
    queryFn: () => searchAutocomplete({ query }),
    enabled: enabled && query.trim().length > 0,
    staleTime: 30_000,
  });
};
