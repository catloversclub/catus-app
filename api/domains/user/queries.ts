import { uploadImage } from "@/api/domains/common/api";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  blockUser,
  checkNickname,
  createUser,
  deleteUser,
  followUser,
  getBlockedUsers,
  getUserById,
  getUserFollowers,
  getUserFollowings,
  getUserProfile,
  getUserProfileImageUploadUrl,
  unblockUser,
  unfollowUser,
  updateUser,
} from "./api";

const DEFAULT_TAKE = 20;

export const userKeys = {
  all: ["user"] as const,
  me: () => [...userKeys.all, "me"] as const,
  detail: (userId: string) => [...userKeys.all, "detail", userId] as const,
  checkNickname: (nickname: string) =>
    [...userKeys.all, "nickname", nickname] as const,
  followers: (userId: string) =>
    [...userKeys.all, "followers", userId] as const,
  followings: (userId: string) =>
    [...userKeys.all, "followings", userId] as const,
  blocks: () => [...userKeys.all, "blocks"] as const,
};

export const useUserProfileQuery = () => {
  return useSuspenseQuery({
    queryKey: userKeys.me(),
    queryFn: getUserProfile,
  });
};

export const useUserDetailQuery = (userId: string) => {
  return useSuspenseQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => getUserById(userId),
  });
};


export const useCheckNicknameQuery = (nickname: string, enabled: boolean) => {
  return useQuery({
    queryKey: userKeys.checkNickname(nickname),
    queryFn: () => checkNickname(nickname),
    enabled: enabled && nickname.length > 0,
  });
};

export const useUserFollowersQuery = (userId: string) => {
  return useSuspenseInfiniteQuery({
    queryKey: userKeys.followers(userId),
    queryFn: ({ pageParam }) =>
      getUserFollowers(userId, {
        take: DEFAULT_TAKE,
        cursor: pageParam,
      }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => {
      if (lastPage.length < DEFAULT_TAKE) return undefined;
      return lastPage[lastPage.length - 1].cursor;
    },
  });
};

export const useUserFollowingsQuery = (userId: string) => {
  return useSuspenseInfiniteQuery({
    queryKey: userKeys.followings(userId),
    queryFn: ({ pageParam }) =>
      getUserFollowings(userId, {
        take: DEFAULT_TAKE,
        cursor: pageParam,
      }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => {
      if (lastPage.length < DEFAULT_TAKE) return undefined;
      return lastPage[lastPage.length - 1].cursor;
    },
  });
};

export const useBlockedUsersQuery = () => {
  return useSuspenseInfiniteQuery({
    queryKey: userKeys.blocks(),
    queryFn: ({ pageParam }) =>
      getBlockedUsers({
        take: DEFAULT_TAKE,
        cursor: pageParam,
      }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => {
      if (lastPage.length < DEFAULT_TAKE) return undefined;
      return lastPage[lastPage.length - 1].cursor;
    },
  });
};

export const useCreateUserMutation = () => {
  return useMutation({
    mutationFn: createUser,
  });
};

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
    },
  });
};

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.clear();
    },
  });
};

export const useFollowUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => followUser(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
      queryClient.invalidateQueries({ queryKey: userKeys.followings(userId) });
    },
  });
};

export const useUnfollowUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => unfollowUser(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
      queryClient.invalidateQueries({ queryKey: userKeys.followings(userId) });
    },
  });
};

export const useBlockUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => blockUser(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: userKeys.blocks() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
    },
  });
};

export const useUnblockUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => unblockUser(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: userKeys.blocks() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
    },
  });
};

export const useGetProfileImageUploadUrlMutation = () => {
  return useMutation({
    mutationKey: [...userKeys.all, "profileImageUploadUrl"] as const,
    mutationFn: getUserProfileImageUploadUrl,
  });
};

export const useUploadProfileImageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [...userKeys.all, "uploadProfileImage"] as const,
    mutationFn: uploadImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
    },
  });
};
