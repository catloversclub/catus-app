import { Stack, useLocalSearchParams } from "expo-router";
import { Suspense } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";

import { usePostByIdQuery } from "@/api/domains/post/queries";
import { useLogoRefreshControl } from "@/components/common/logo-refresh-control";
import CommentInputBar, { ReplyTarget } from "@/components/feed/comment-input-bar";
import CommentList from "@/components/feed/comment-list";
import PostDetailCard from "@/components/feed/post-detail-card";
import { useColors } from "@/hooks/use-colors";
import { useKeyboardAvoidingView } from "@/hooks/use-keyboard-avoiding-view";
import { useHeaderHeight } from "@react-navigation/elements";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PostDetailContent = ({ postId }: { postId: string }) => {
  const { colors } = useColors();
  const { data: post, refetch } = usePostByIdQuery(postId);
  const [replyTarget, setReplyTarget] = useState<ReplyTarget | null>(null);
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { androidBottomStyle } = useKeyboardAvoidingView();
  const { refreshControl, logoOverlay } = useLogoRefreshControl({ onRefresh: refetch });

  return (
    <>
      <Stack.Screen
        options={{
          title: `${post.author.nickname}의 게시물`,
          headerTintColor: colors.text.primary,
        }}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={headerHeight}
      >
        <Animated.View style={[{ flex: 1 }, androidBottomStyle]}>
          {logoOverlay}
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={refreshControl}
            contentContainerStyle={{
              paddingBottom: 16,
              rowGap: 24,
            }}
          >
            <PostDetailCard post={post} />
            <CommentList postId={post.id} onReply={setReplyTarget} />
          </ScrollView>
          <CommentInputBar
            postId={post.id}
            replyTarget={replyTarget}
            onClearReply={() => setReplyTarget(null)}
            paddingBottom={insets.bottom}
          />
        </Animated.View>
      </KeyboardAvoidingView>
    </>
  );
};

const PostDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={{ flex: 1 }} className="bg-semantic-bg-primary">
      <Suspense
        fallback={
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#000" />
          </View>
        }
      >
        <PostDetailContent postId={id} />
      </Suspense>
    </View>
  );
};

export default PostDetailScreen;
