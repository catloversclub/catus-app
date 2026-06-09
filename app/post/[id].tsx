import { useLocalSearchParams } from "expo-router";
import { SuspenseWithDelay } from "@/components/ui/suspense-with-delay";
import { useRef } from "react";
import { View } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

import { commentKeys } from "@/api/domains/comment/queries";
import { postKeys } from "@/api/domains/post/queries";
import Gradient from "@/components/common/gradient";
import { useLogoRefreshControl } from "@/components/common/logo-refresh-control";
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
  const { refreshControl } = useLogoRefreshControl({ onRefresh });

  return (
    <View className="flex-1 bg-semantic-bg-primary">
      <KeyboardAvoidingView className="flex-1" {...keyboardAvoidingViewProps}>
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
              onReply={(target) => inputRef.current?.setReplyTarget(target)}
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
            paddingBottom={insets.bottom}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default PostDetailScreen;
