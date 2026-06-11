import { useLocalSearchParams } from "expo-router";
import { SuspenseWithDelay } from "@/components/ui/suspense-with-delay";
import { View } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

import { commentKeys } from "@/api/domains/comment/queries";
import { postKeys } from "@/api/domains/post/queries";
import { userKeys } from "@/api/domains/user/queries";
import Gradient from "@/components/common/gradient";
import { useLogoRefreshControl } from "@/components/common/logo-refresh-control";
import useCommentReplyInput from "@/hooks/comment/use-comment-reply-input";
import { useRefreshQueries } from "@/hooks/use-refresh-queries";
import CommentInputBar from "@/components/comment/input-bar";
import CommentList, { CommentListSkeleton } from "@/components/comment/list";
import PostDetailCard, {
  PostDetailCardSkeleton,
} from "@/components/post/detail-card";
import { useKeyboardAvoidingView } from "@/hooks/use-keyboard-avoiding-view";
import { useHeaderHeight } from "@react-navigation/elements";

const PostDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { inputRef, replyTarget, handleReply, clearReplyTarget } =
    useCommentReplyInput();
  const headerHeight = useHeaderHeight();
  const { keyboardAvoidingViewProps } = useKeyboardAvoidingView(headerHeight);
  const onRefresh = useRefreshQueries([
    userKeys.me(),
    postKeys.detail(id),
    commentKeys.byPost(id),
  ]);
  const { refreshControl } = useLogoRefreshControl({ onRefresh });

  return (
    <View className="flex-1 bg-semantic-bg-primary">
      <KeyboardAvoidingView {...keyboardAvoidingViewProps}>
        <View className="flex-1">
          <Gradient
            direction="vertical"
            height={10}
            style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
          />
          <SuspenseWithDelay
            fallback={
              <View className="gap-y-6 px-3 pb-4 pt-2">
                <PostDetailCardSkeleton />
                <CommentListSkeleton />
              </View>
            }
          >
            <CommentList
              postId={id}
              onReply={handleReply}
              ListHeaderComponent={
                <View className="mb-6">
                  <PostDetailCard postId={id} />
                </View>
              }
              contentContainerStyle={{ paddingTop: 10, paddingBottom: 16 }}
              refreshControl={refreshControl}
            />
          </SuspenseWithDelay>
          <CommentInputBar
            postId={id}
            inputRef={inputRef}
            replyTarget={replyTarget}
            onClearReply={clearReplyTarget}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default PostDetailScreen;
