import { getPostComments } from "@/api/domains/comment/api";
import { commentKeys } from "@/api/domains/comment/queries";
import BaseBottomSheet from "@/components/bottom-sheet/base-bottom-sheet";
import CommentInputBar, {
  ReplyTarget,
} from "@/components/feed/comment-input-bar";
import CommentList from "@/components/feed/comment-list";
import { Text } from "@/components/ui/text";
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { useQuery } from "@tanstack/react-query";
import React, { Suspense, useState } from "react";
import { ActivityIndicator, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface CommentSheetProps {
  postId: string;
  CommentSheetModalRef: React.RefObject<BottomSheetModal | null>;
}

const CommentSheet = ({ CommentSheetModalRef, postId }: CommentSheetProps) => {
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();
  const [replyTarget, setReplyTarget] = useState<ReplyTarget | null>(null);

  const { data: commentCount } = useQuery({
    queryKey: commentKeys.byPost(postId),
    queryFn: () => getPostComments(postId),
    select: (data) => data.length,
  });

  return (
    <BaseBottomSheet
      BaseBottomSheetModalRef={CommentSheetModalRef}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
    >
      <View style={{ height: screenHeight * 0.6 }}>
        <View className="items-center border-b border-semantic-border-primary bg-semantic-bg-secondary py-3">
          <Text className="typo-body1 text-semantic-text-primary">
            댓글{commentCount != null ? ` ${commentCount}` : ""}
          </Text>
        </View>

        <BottomSheetScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 8 }}
        >
          <Suspense
            fallback={
              <View className="items-center justify-center py-12">
                <ActivityIndicator />
              </View>
            }
          >
            <CommentList postId={postId} onReply={setReplyTarget} />
          </Suspense>
        </BottomSheetScrollView>

        <CommentInputBar
          postId={postId}
          replyTarget={replyTarget}
          onClearReply={() => setReplyTarget(null)}
          paddingBottom={insets.bottom + 8}
          InputComponent={BottomSheetTextInput}
        />
      </View>
    </BaseBottomSheet>
  );
};

export default CommentSheet;
