import { usePostCommentsQuery } from "@/api/domains/comment/queries";
import BaseBottomSheet from "@/components/bottom-sheet/base-bottom-sheet";
import CommentInputBar, {
  ReplyTarget,
} from "@/components/feed/comment-input-bar";
import CommentList, {
  CommentListSkeleton,
} from "@/components/feed/comment-list";
import { Text } from "@/components/ui/text";
import {
  BottomSheetFooter,
  BottomSheetFooterProps,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import React, { Suspense, useCallback, useState } from "react";
import { View } from "react-native";

interface CommentSheetProps {
  postId: string;
  CommentSheetModalRef: React.RefObject<BottomSheetModal | null>;
}

const CommentCount = ({ postId }: { postId: string }) => {
  const { data: comments } = usePostCommentsQuery(postId);
  return (
    <Text className="typo-body2 text-semantic-text-secondary">
      {comments.length}
    </Text>
  );
};

const CommentSheet = ({ CommentSheetModalRef, postId }: CommentSheetProps) => {
  const [replyTarget, setReplyTarget] = useState<ReplyTarget | null>(null);

  const footerComponent = useCallback(
    (props: BottomSheetFooterProps) => (
      <BottomSheetFooter {...props}>
        <CommentInputBar
          postId={postId}
          replyTarget={replyTarget}
          onClearReply={() => setReplyTarget(null)}
          InputComponent={BottomSheetTextInput}
        />
      </BottomSheetFooter>
    ),
    [postId, replyTarget],
  );

  return (
    <BaseBottomSheet
      BaseBottomSheetModalRef={CommentSheetModalRef}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      snapPoints={["65%", "90%"]}
      footerComponent={footerComponent}
    >
      <View className="flex-row items-center justify-center gap-1 py-3">
        <Text className="typo-body1 text-semantic-text-tertiary">댓글</Text>
        <Suspense fallback={null}>
          <CommentCount postId={postId} />
        </Suspense>
      </View>

      <BottomSheetScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <Suspense fallback={<CommentListSkeleton />}>
          <CommentList postId={postId} onReply={setReplyTarget} />
        </Suspense>
      </BottomSheetScrollView>
    </BaseBottomSheet>
  );
};

export default CommentSheet;
