import { useLocalSearchParams } from "expo-router";
import { SuspenseWithDelay } from "@/components/ui/suspense-with-delay";
import { useRef } from "react";
import { View } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

import { commentKeys } from "@/api/domains/comment/queries";
import { postKeys } from "@/api/domains/post/queries";
import { RefreshableScrollView } from "@/components/common/logo-refresh-control";
import { useRefreshQueries } from "@/hooks/use-refresh-queries";
import CommentInputBar, { CommentInputRef } from "@/components/comment/input-bar";
import CommentList, { CommentListSkeleton } from "@/components/comment/list";
import PostDetailCard, {
  PostDetailCardSkeleton,
} from "@/components/post/detail-card";
import { useKeyboardAvoidingView } from "@/hooks/use-keyboard-avoiding-view";
import { useHeaderHeight } from "@react-navigation/elements";

const PostDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const inputRef = useRef<CommentInputRef>(null);
  const headerHeight = useHeaderHeight();
  const { keyboardAvoidingViewProps, insets } =
    useKeyboardAvoidingView(headerHeight);
  const onRefresh = useRefreshQueries([
    postKeys.detail(id),
    commentKeys.byPost(id),
  ]);

  return (
    <View className="flex-1 bg-semantic-bg-primary">
      <KeyboardAvoidingView className="flex-1" {...keyboardAvoidingViewProps}>
        <View className="flex-1">
          <RefreshableScrollView
            onRefresh={onRefresh}
            contentContainerClassName="pb-4 gap-y-6"
          >
            <SuspenseWithDelay fallback={<PostDetailCardSkeleton />}>
              <PostDetailCard postId={id} />
            </SuspenseWithDelay>
            <SuspenseWithDelay fallback={<CommentListSkeleton />}>
              <CommentList
                postId={id}
                onReply={(target) => inputRef.current?.setReplyTarget(target)}
              />
            </SuspenseWithDelay>
          </RefreshableScrollView>
          <CommentInputBar
            postId={id}
            inputRef={inputRef}
            paddingBottom={insets.bottom}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default PostDetailScreen;
