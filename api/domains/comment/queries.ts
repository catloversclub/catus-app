import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { postKeys } from "@/api/domains/post/queries"

import {
  createComment,
  deleteComment,
  getPostComments,
  likeComment,
  reportComment,
  unlikeComment,
} from "./api"
import { CreateCommentRequest } from "./types"

export const commentKeys = {
  all: ["comment"] as const,
  byPost: (postId: string) => [...commentKeys.all, "post", postId] as const,
}

export const postCommentsQueryOptions = (postId: string) => queryOptions({
  queryKey: commentKeys.byPost(postId),
  queryFn: () => getPostComments(postId),
  staleTime: Infinity,
  gcTime: Infinity,
  refetchOnMount: (query) => query.state.isInvalidated,
})

export const usePostCommentsQuery = (postId: string) => {
  return useSuspenseQuery({
    ...postCommentsQueryOptions(postId),
  })
}

export const useCreateCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ postId, payload }: { postId: string; payload: CreateCommentRequest }) =>
      createComment(postId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.byPost(variables.postId) })
      queryClient.invalidateQueries({ queryKey: postKeys.all })
    },
  })
}

export const useDeleteCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ postId, commentId }: { postId: string; commentId: string }) =>
      deleteComment(commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.byPost(variables.postId) })
      queryClient.invalidateQueries({ queryKey: postKeys.all })
    },
  })
}

export const useReportCommentMutation = () => {
  return useMutation({
    mutationFn: (commentId: string) => reportComment(commentId),
  })
}

export const useLikeCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ postId, commentId }: { postId: string; commentId: string }) =>
      likeComment(commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.byPost(variables.postId) })
    },
  })
}

export const useUnlikeCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ postId, commentId }: { postId: string; commentId: string }) =>
      unlikeComment(commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.byPost(variables.postId) })
    },
  })
}
