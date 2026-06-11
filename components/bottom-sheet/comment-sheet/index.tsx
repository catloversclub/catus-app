import { usePostCommentsNonSuspenseQuery } from "@/api/domains/comment/queries";
import BaseBottomSheet from "@/components/bottom-sheet/base-bottom-sheet";
import CommentInputBar from "@/components/comment/input-bar";
import { CommentListEmpty, CommentListSkeleton } from "@/components/comment/list";
import { Text } from "@/components/ui/text";
import useCommentItemRenderer from "@/hooks/comment/use-comment-item-renderer";
import useCommentReplyInput from "@/hooks/comment/use-comment-reply-input";
import {
  BottomSheetFlatList,
  BottomSheetFooter,
  BottomSheetFooterProps,
  BottomSheetModal,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useState } from "react";
import { LayoutChangeEvent, View } from "react-native";

interface CommentSheetProps {
  postId: string;
  CommentSheetModalRef: React.RefObject<BottomSheetModal | null>;
}

const CommentSheet = ({ CommentSheetModalRef, postId }: CommentSheetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [footerHeight, setFooterHeight] = useState(0);
  const { inputRef, replyTarget, handleReply, clearReplyTarget } =
    useCommentReplyInput();
  const {
    data: comments = [],
    isPending,
  } = usePostCommentsNonSuspenseQuery(postId, isOpen);
  const { renderComment } = useCommentItemRenderer({
    postId,
    onReply: handleReply,
  });

  const handleFooterLayout = useCallback((event: LayoutChangeEvent) => {
    const nextHeight = event.nativeEvent.layout.height;
    setFooterHeight((prevHeight) =>
      prevHeight === nextHeight ? prevHeight : nextHeight,
    );
  }, []);

  const footerComponent = useCallback(
    (props: BottomSheetFooterProps) => (
      <BottomSheetFooter {...props}>
        <CommentInputBar
          postId={postId}
          InputComponent={BottomSheetTextInput}
          inputRef={inputRef}
          replyTarget={replyTarget}
          onClearReply={clearReplyTarget}
          onLayout={handleFooterLayout}
        />
      </BottomSheetFooter>
    ),
    [clearReplyTarget, handleFooterLayout, inputRef, postId, replyTarget],
  );

  const handleChange = useCallback((index: number) => {
    setIsOpen(index >= 0);
  }, []);

  const handleDismiss = useCallback(() => {
    setIsOpen(false);
    clearReplyTarget();
  }, [clearReplyTarget]);

  const listHeaderComponent = useCallback(
    () => (
      <View className="flex-row items-center justify-center gap-1 py-3">
        <Text className="typo-body1 text-semantic-text-tertiary">댓글</Text>
        <Text className="typo-body2 text-semantic-text-secondary">
          {comments.length}
        </Text>
      </View>
    ),
    [comments.length],
  );

  const listEmptyComponent = useCallback(() => {
    if (isPending) {
      return <CommentListSkeleton />;
    }

    return <CommentListEmpty />;
  }, [isPending]);

  return (
    <BaseBottomSheet
      BaseBottomSheetModalRef={CommentSheetModalRef}
      onChange={handleChange}
      onDismiss={handleDismiss}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      snapPoints={["65%", "90%"]}
      footerComponent={footerComponent}
      withContentContainer={false}
    >
      <BottomSheetFlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={renderComment}
        ListHeaderComponent={listHeaderComponent}
        ListEmptyComponent={listEmptyComponent}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 12,
          paddingBottom: footerHeight,
        }}
        initialNumToRender={8}
        maxToRenderPerBatch={6}
        updateCellsBatchingPeriod={50}
        windowSize={5}
        keyboardShouldPersistTaps="handled"
      />
    </BaseBottomSheet>
  );
};

export default CommentSheet;
