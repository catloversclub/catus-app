import { usePostCommentsQuery } from "@/api/domains/comment/queries";
import BaseBottomSheet from "@/components/bottom-sheet/base-bottom-sheet";
import CommentInputBar, {
  ReplyTarget,
} from "@/components/comment/input-bar";
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
import React, { Suspense, useCallback, useState } from "react";
import { LayoutChangeEvent, View } from "react-native";

interface CommentSheetProps {
  postId: string;
  CommentSheetModalRef: React.RefObject<BottomSheetModal | null>;
}

interface CommentSheetListProps {
  postId: string;
  footerHeight: number;
  onReply: (target: ReplyTarget) => void;
}

const CommentSheetLoadingList = ({ footerHeight }: { footerHeight: number }) => (
  <BottomSheetFlatList
    data={[]}
    renderItem={() => null}
    ListHeaderComponent={
      <View className="flex-row items-center justify-center py-3">
        <Text className="typo-body1 text-semantic-text-tertiary">댓글</Text>
      </View>
    }
    ListEmptyComponent={<CommentListSkeleton />}
    contentContainerStyle={{
      flexGrow: 1,
      paddingHorizontal: 12,
      paddingBottom: footerHeight,
    }}
  />
);

const CommentSheetList = ({
  postId,
  footerHeight,
  onReply,
}: CommentSheetListProps) => {
  const { data: comments } = usePostCommentsQuery(postId);
  const { renderComment } = useCommentItemRenderer({ postId, onReply });

  return (
    <BottomSheetFlatList
      data={comments}
      keyExtractor={(item) => item.id}
      renderItem={renderComment}
      ListHeaderComponent={
        <View className="flex-row items-center justify-center gap-1 py-3">
          <Text className="typo-body1 text-semantic-text-tertiary">댓글</Text>
          <Text className="typo-body2 text-semantic-text-secondary">
            {comments.length}
          </Text>
        </View>
      }
      ListEmptyComponent={<CommentListEmpty />}
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
  );
};

const CommentSheet = ({ CommentSheetModalRef, postId }: CommentSheetProps) => {
  const [hasPresented, setHasPresented] = useState(false);
  const [footerHeight, setFooterHeight] = useState(0);
  const { inputRef, replyTarget, handleReply, clearReplyTarget } =
    useCommentReplyInput();

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

  const handleDismiss = useCallback(() => {
    clearReplyTarget();
  }, [clearReplyTarget]);

  const handleChange = useCallback((index: number) => {
    if (index >= 0) {
      setHasPresented(true);
    }
  }, []);

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
      {hasPresented ? (
        <Suspense
          fallback={<CommentSheetLoadingList footerHeight={footerHeight} />}
        >
          <CommentSheetList
            postId={postId}
            footerHeight={footerHeight}
            onReply={handleReply}
          />
        </Suspense>
      ) : (
        <CommentSheetLoadingList footerHeight={footerHeight} />
      )}
    </BaseBottomSheet>
  );
};

export default CommentSheet;
