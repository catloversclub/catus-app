import { useLocalSearchParams } from "expo-router";
import { Suspense, useState } from "react";
import { KeyboardAvoidingView, View } from "react-native";

import { commentKeys } from "@/api/domains/comment/queries";
import { postKeys } from "@/api/domains/post/queries";
import { RefreshableScrollView } from "@/components/common/logo-refresh-control";
import { useRefreshQueries } from "@/hooks/use-refresh-queries";
import CommentInputBar, {
  ReplyTarget,
} from "@/components/comment/input-bar";
import CommentList, {
  CommentListSkeleton,
} from "@/components/comment/list";
import PostDetailCard, {
  PostDetailCardSkeleton,
} from "@/components/post/detail-card";
import { useKeyboardAvoidingView } from "@/hooks/use-keyboard-avoiding-view";
import { useHeaderHeight } from "@react-navigation/elements";
import Animated from "react-native-reanimated";

const PostDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [replyTarget, setReplyTarget] = useState<ReplyTarget | null>(null);
  const headerHeight = useHeaderHeight();
  const { keyboardAvoidingViewProps, containerStyle, insets } =
    useKeyboardAvoidingView(headerHeight);
  const onRefresh = useRefreshQueries([postKeys.detail(id), commentKeys.byPost(id)]);

  return (
    <View style={{ flex: 1 }} className="bg-semantic-bg-primary">
      <KeyboardAvoidingView style={{ flex: 1 }} {...keyboardAvoidingViewProps}>
        <Animated.View style={[{ flex: 1 }, containerStyle]}>
          <RefreshableScrollView
            onRefresh={onRefresh}
            contentContainerStyle={{ paddingBottom: 16, rowGap: 24 }}
          >
            <Suspense fallback={<PostDetailCardSkeleton />}>
              <PostDetailCard postId={id} />
            </Suspense>
            <Suspense fallback={<CommentListSkeleton />}>
              <CommentList postId={id} onReply={setReplyTarget} />
            </Suspense>
          </RefreshableScrollView>
          <CommentInputBar
            postId={id}
            replyTarget={replyTarget}
            onClearReply={() => setReplyTarget(null)}
            paddingBottom={insets.bottom}
          />
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default PostDetailScreen;
