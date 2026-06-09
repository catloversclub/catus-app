import {
  InfiniteData,
  useMutation,
  useQueryClient,
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";

import { POST_PAGINATION } from "@/constants/posts";
import {
  bookmarkPost,
  createPost,
  deletePost,
  getCatPosts,
  getDailyPopularPosts,
  getFollowingFeed,
  getMyBookmarkedPosts,
  getMyLikedPosts,
  getMyPosts,
  getPostById,
  getPostImageUploadUrl,
  getRecommendedFeed,
  getUserPosts,
  likePost,
  reportPost,
  unbookmarkPost,
  unlikePost,
  updatePost,
} from "./api";
import { useUserProfileQuery } from "@/api/domains/user/queries";
import { CreatePostRequest, Post, UpdatePostRequest } from "./types";

export const postKeys = {
  all: ["post"] as const,
  detail: (postId: string) => [...postKeys.all, "detail", postId] as const,
  myPosts: () => [...postKeys.all, "my"] as const,
  myBookmarkedPosts: () => [...postKeys.all, "my", "bookmarked"] as const,
  myLikedPosts: () => [...postKeys.all, "my", "liked"] as const,
  dailyPopular: () => [...postKeys.all, "feed", "daily-popular"] as const,
  userPosts: (userId: string) => [...postKeys.all, "user", userId] as const,
  catPosts: (catId: string) => [...postKeys.all, "cat", catId] as const,
  followingFeed: () => [...postKeys.all, "feed", "following"] as const,
  recommendedFeed: () => [...postKeys.all, "feed", "recommended"] as const,
};

export const usePostByIdQuery = (postId: string) => {
  return useSuspenseQuery({
    queryKey: postKeys.detail(postId),
    queryFn: () => getPostById(postId),
  });
};

export const useMyPostsQuery = () => {
  return useSuspenseInfiniteQuery({
    queryKey: postKeys.myPosts(),
    queryFn: ({ pageParam }) =>
      getMyPosts({
        take: POST_PAGINATION.DEFAULT_TAKE,
        cursor: pageParam,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.length < POST_PAGINATION.DEFAULT_TAKE)
        return undefined;
      return lastPage[lastPage.length - 1].id;
    },
  });
};

export const useMyBookmarkedPostsQuery = () => {
  return useSuspenseInfiniteQuery({
    queryKey: postKeys.myBookmarkedPosts(),
    queryFn: ({ pageParam }) =>
      getMyBookmarkedPosts({
        take: POST_PAGINATION.DEFAULT_TAKE,
        cursor: pageParam,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.length < POST_PAGINATION.DEFAULT_TAKE)
        return undefined;
      return lastPage[lastPage.length - 1].id;
    },
  });
};

export const useMyLikedPostsQuery = () => {
  return useSuspenseInfiniteQuery({
    queryKey: postKeys.myLikedPosts(),
    queryFn: ({ pageParam }) =>
      getMyLikedPosts({
        take: POST_PAGINATION.DEFAULT_TAKE,
        cursor: pageParam,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.length < POST_PAGINATION.DEFAULT_TAKE)
        return undefined;
      return lastPage[lastPage.length - 1].id;
    },
  });
};

export const useDailyPopularPostsQuery = () => {
  return useSuspenseQuery({
    queryKey: postKeys.dailyPopular(),
    queryFn: () => getDailyPopularPosts(),
  });
};

export const useUserPostsQuery = (userId: string) => {
  return useSuspenseInfiniteQuery({
    queryKey: postKeys.userPosts(userId),
    queryFn: ({ pageParam }) =>
      getUserPosts(userId, {
        take: POST_PAGINATION.DEFAULT_TAKE,
        cursor: pageParam,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.length < POST_PAGINATION.DEFAULT_TAKE)
        return undefined;
      return lastPage[lastPage.length - 1].id;
    },
  });
};

export const useCatPostsQuery = (catId: string) => {
  return useSuspenseInfiniteQuery({
    queryKey: postKeys.catPosts(catId),
    queryFn: ({ pageParam }) =>
      getCatPosts(catId, {
        take: POST_PAGINATION.DEFAULT_TAKE,
        cursor: pageParam,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.length < POST_PAGINATION.DEFAULT_TAKE)
        return undefined;
      return lastPage[lastPage.length - 1].id;
    },
  });
};

export const useFollowingFeedQuery = () => {
  return useSuspenseInfiniteQuery({
    queryKey: postKeys.followingFeed(),
    queryFn: ({ pageParam }) =>
      getFollowingFeed({
        take: POST_PAGINATION.DEFAULT_TAKE,
        cursor: pageParam,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.length < POST_PAGINATION.DEFAULT_TAKE)
        return undefined;
      return lastPage[lastPage.length - 1].id;
    },
  });
};

export const useRecommendedFeedQuery = () => {
  return useSuspenseInfiniteQuery({
    queryKey: postKeys.recommendedFeed(),
    queryFn: ({ pageParam }) =>
      getRecommendedFeed({
        take: POST_PAGINATION.DEFAULT_TAKE,
        cursor: pageParam,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.length < POST_PAGINATION.DEFAULT_TAKE)
        return undefined;
      return lastPage[lastPage.length - 1].id;
    },
  });
};

export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();
  const { data: userProfile } = useUserProfileQuery();

  return useMutation({
    mutationFn: (payload: CreatePostRequest) => createPost(payload),
    onSuccess: (post) => {
      queryClient.invalidateQueries({ queryKey: postKeys.myPosts() });
      queryClient.invalidateQueries({ queryKey: postKeys.followingFeed() });
      queryClient.invalidateQueries({ queryKey: postKeys.recommendedFeed() });
      queryClient.invalidateQueries({ queryKey: postKeys.userPosts(userProfile.id) });
      post.cats.forEach((cat) => {
        queryClient.invalidateQueries({ queryKey: postKeys.catPosts(cat.id) });
      });
    },
  });
};

export const useUpdatePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      payload,
    }: {
      postId: string;
      payload: UpdatePostRequest;
    }) => updatePost(postId, payload),
    onSuccess: (post, variables) => {
      const previousPost = queryClient.getQueryData<Post>(
        postKeys.detail(variables.postId),
      );

      queryClient.invalidateQueries({
        queryKey: postKeys.detail(variables.postId),
      });
      queryClient.invalidateQueries({ queryKey: postKeys.myPosts() });
      queryClient.invalidateQueries({ queryKey: postKeys.followingFeed() });
      queryClient.invalidateQueries({ queryKey: postKeys.recommendedFeed() });

      const catIds = new Set([
        ...post.cats.map((cat) => cat.id),
        ...(previousPost?.cats.map((cat) => cat.id) ?? []),
        ...(variables.payload.catIds ?? []),
      ]);

      catIds.forEach((catId) => {
        queryClient.invalidateQueries({ queryKey: postKeys.catPosts(catId) });
      });
    },
  });
};

export const useDeletePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.myPosts() });
      queryClient.invalidateQueries({ queryKey: postKeys.followingFeed() });
      queryClient.invalidateQueries({ queryKey: postKeys.recommendedFeed() });
    },
  });
};

export const useReportPostMutation = () => {
  return useMutation({
    mutationFn: ({
      postId,
    }: {
      postId: string;
      reason?: string;
      description?: string;
    }) => reportPost(postId),
  });
};

export const useLikePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId }: { postId: string }) => likePost(postId),

    onMutate: async ({ postId }) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: postKeys.followingFeed() }),
        queryClient.cancelQueries({ queryKey: postKeys.recommendedFeed() }),
        queryClient.cancelQueries({ queryKey: postKeys.detail(postId) }),
      ]);

      const prevFollowing = queryClient.getQueryData<InfiniteData<Post[]>>(
        postKeys.followingFeed(),
      );
      const prevRecommended = queryClient.getQueryData<InfiniteData<Post[]>>(
        postKeys.recommendedFeed(),
      );
      const prevDetail = queryClient.getQueryData<Post>(
        postKeys.detail(postId),
      );

      const updateFeed = (
        oldData: InfiniteData<Post[]> | undefined,
      ): InfiniteData<Post[]> | undefined => {
        if (!oldData) return undefined;
        return {
          ...oldData,
          pages: oldData.pages.map((page) =>
            page.map((post) =>
              post.id === postId
                ? { ...post, isLikedByMe: true, likeCount: post.likeCount + 1 }
                : post,
            ),
          ),
        };
      };

      queryClient.setQueryData<InfiniteData<Post[]>>(
        postKeys.followingFeed(),
        updateFeed,
      );
      queryClient.setQueryData<InfiniteData<Post[]>>(
        postKeys.recommendedFeed(),
        updateFeed,
      );
      queryClient.setQueryData<Post>(postKeys.detail(postId), (old) =>
        old ? { ...old, isLikedByMe: true, likeCount: old.likeCount + 1 } : old,
      );

      return { prevFollowing, prevRecommended, prevDetail };
    },

    onError: (err, variables, context) => {
      if (context) {
        queryClient.setQueryData(
          postKeys.followingFeed(),
          context.prevFollowing,
        );
        queryClient.setQueryData(
          postKeys.recommendedFeed(),
          context.prevRecommended,
        );
        queryClient.setQueryData(
          postKeys.detail(variables.postId),
          context.prevDetail,
        );
      }
    },

    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: postKeys.followingFeed() });
      queryClient.invalidateQueries({ queryKey: postKeys.recommendedFeed() });
      queryClient.invalidateQueries({
        queryKey: postKeys.detail(variables.postId),
      });
    },
  });
};

export const useUnlikePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId }: { postId: string }) => unlikePost(postId),

    onMutate: async ({ postId }) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: postKeys.followingFeed() }),
        queryClient.cancelQueries({ queryKey: postKeys.recommendedFeed() }),
        queryClient.cancelQueries({ queryKey: postKeys.detail(postId) }),
      ]);

      const prevFollowing = queryClient.getQueryData<InfiniteData<Post[]>>(
        postKeys.followingFeed(),
      );
      const prevRecommended = queryClient.getQueryData<InfiniteData<Post[]>>(
        postKeys.recommendedFeed(),
      );
      const prevDetail = queryClient.getQueryData<Post>(
        postKeys.detail(postId),
      );

      const updateFeed = (
        oldData: InfiniteData<Post[]> | undefined,
      ): InfiniteData<Post[]> | undefined => {
        if (!oldData) return undefined;
        return {
          ...oldData,
          pages: oldData.pages.map((page) =>
            page.map((post) =>
              post.id === postId
                ? {
                    ...post,
                    isLikedByMe: false,
                    likeCount: Math.max(0, post.likeCount - 1),
                  }
                : post,
            ),
          ),
        };
      };

      queryClient.setQueryData<InfiniteData<Post[]>>(
        postKeys.followingFeed(),
        updateFeed,
      );
      queryClient.setQueryData<InfiniteData<Post[]>>(
        postKeys.recommendedFeed(),
        updateFeed,
      );
      queryClient.setQueryData<Post>(postKeys.detail(postId), (old) =>
        old
          ? {
              ...old,
              isLikedByMe: false,
              likeCount: Math.max(0, old.likeCount - 1),
            }
          : old,
      );

      return { prevFollowing, prevRecommended, prevDetail };
    },

    onError: (err, variables, context) => {
      if (context) {
        queryClient.setQueryData(
          postKeys.followingFeed(),
          context.prevFollowing,
        );
        queryClient.setQueryData(
          postKeys.recommendedFeed(),
          context.prevRecommended,
        );
        queryClient.setQueryData(
          postKeys.detail(variables.postId),
          context.prevDetail,
        );
      }
    },

    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: postKeys.followingFeed() });
      queryClient.invalidateQueries({ queryKey: postKeys.recommendedFeed() });
      queryClient.invalidateQueries({
        queryKey: postKeys.detail(variables.postId),
      });
    },
  });
};

export const useBookmarkMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId }: { postId: string }) => bookmarkPost(postId),

    onMutate: async ({ postId }) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: postKeys.followingFeed() }),
        queryClient.cancelQueries({ queryKey: postKeys.recommendedFeed() }),
        queryClient.cancelQueries({ queryKey: postKeys.detail(postId) }),
      ]);

      const prevFollowing = queryClient.getQueryData<InfiniteData<Post[]>>(
        postKeys.followingFeed(),
      );
      const prevRecommended = queryClient.getQueryData<InfiniteData<Post[]>>(
        postKeys.recommendedFeed(),
      );
      const prevDetail = queryClient.getQueryData<Post>(
        postKeys.detail(postId),
      );

      const updateFeed = (
        oldData: InfiniteData<Post[]> | undefined,
      ): InfiniteData<Post[]> | undefined => {
        if (!oldData) return undefined;
        return {
          ...oldData,
          pages: oldData.pages.map((page) =>
            page.map((post) =>
              post.id === postId ? { ...post, isBookmarkedByMe: true } : post,
            ),
          ),
        };
      };

      queryClient.setQueryData<InfiniteData<Post[]>>(
        postKeys.followingFeed(),
        updateFeed,
      );
      queryClient.setQueryData<InfiniteData<Post[]>>(
        postKeys.recommendedFeed(),
        updateFeed,
      );
      queryClient.setQueryData<Post>(postKeys.detail(postId), (old) =>
        old ? { ...old, isBookmarkedByMe: true } : old,
      );

      return { prevFollowing, prevRecommended, prevDetail };
    },

    onError: (err, variables, context) => {
      if (context) {
        queryClient.setQueryData(
          postKeys.followingFeed(),
          context.prevFollowing,
        );
        queryClient.setQueryData(
          postKeys.recommendedFeed(),
          context.prevRecommended,
        );
        queryClient.setQueryData(
          postKeys.detail(variables.postId),
          context.prevDetail,
        );
      }
    },

    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: postKeys.followingFeed() });
      queryClient.invalidateQueries({ queryKey: postKeys.recommendedFeed() });
      queryClient.invalidateQueries({
        queryKey: postKeys.detail(variables.postId),
      });
    },
  });
};

export const useUnbookmarkMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId }: { postId: string }) => unbookmarkPost(postId),

    onMutate: async ({ postId }) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: postKeys.followingFeed() }),
        queryClient.cancelQueries({ queryKey: postKeys.recommendedFeed() }),
        queryClient.cancelQueries({ queryKey: postKeys.detail(postId) }),
      ]);

      const prevFollowing = queryClient.getQueryData<InfiniteData<Post[]>>(
        postKeys.followingFeed(),
      );
      const prevRecommended = queryClient.getQueryData<InfiniteData<Post[]>>(
        postKeys.recommendedFeed(),
      );
      const prevDetail = queryClient.getQueryData<Post>(
        postKeys.detail(postId),
      );

      const updateFeed = (
        oldData: InfiniteData<Post[]> | undefined,
      ): InfiniteData<Post[]> | undefined => {
        if (!oldData) return undefined;
        return {
          ...oldData,
          pages: oldData.pages.map((page) =>
            page.map((post) =>
              post.id === postId ? { ...post, isBookmarkedByMe: false } : post,
            ),
          ),
        };
      };

      queryClient.setQueryData<InfiniteData<Post[]>>(
        postKeys.followingFeed(),
        updateFeed,
      );
      queryClient.setQueryData<InfiniteData<Post[]>>(
        postKeys.recommendedFeed(),
        updateFeed,
      );
      queryClient.setQueryData<Post>(postKeys.detail(postId), (old) =>
        old ? { ...old, isBookmarkedByMe: false } : old,
      );

      return { prevFollowing, prevRecommended, prevDetail };
    },

    onError: (err, variables, context) => {
      if (context) {
        queryClient.setQueryData(
          postKeys.followingFeed(),
          context.prevFollowing,
        );
        queryClient.setQueryData(
          postKeys.recommendedFeed(),
          context.prevRecommended,
        );
        queryClient.setQueryData(
          postKeys.detail(variables.postId),
          context.prevDetail,
        );
      }
    },

    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: postKeys.followingFeed() });
      queryClient.invalidateQueries({ queryKey: postKeys.recommendedFeed() });
      queryClient.invalidateQueries({
        queryKey: postKeys.detail(variables.postId),
      });
    },
  });
};

export const usePostImageUploadUrlMutation = () => {
  return useMutation({
    mutationFn: (count: number) => getPostImageUploadUrl(count),
  });
};
