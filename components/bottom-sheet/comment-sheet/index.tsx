import {
  useLikeCommentMutation,
  usePostCommentsNonSuspenseQuery,
  useUnlikeCommentMutation,
} from "@/api/domains/comment/queries";
import { Comment } from "@/api/domains/comment/types";
import BaseBottomSheet from "@/components/bottom-sheet/base-bottom-sheet";
import CommentInputBar, {
  CommentInputRef,
  ReplyTarget,
} from "@/components/comment/input-bar";
import CommentItem from "@/components/comment/item";
import { CommentListSkeleton } from "@/components/comment/list";
import { Text } from "@/components/ui/text";
import {
  BottomSheetFlatList,
  BottomSheetFooter,
  BottomSheetFooterProps,
  BottomSheetModal,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { LayoutChangeEvent, View } from "react-native";

interface CommentSheetProps {
  postId: string;
  CommentSheetModalRef: React.RefObject<BottomSheetModal | null>;
}

const CommentSheet = ({ CommentSheetModalRef, postId }: CommentSheetProps) => {
  const [replyTarget, setReplyTarget] = useState<ReplyTarget | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [footerHeight, setFooterHeight] = useState(0);
  const inputRef = useRef<CommentInputRef>(null);
  const {
    data: comments = [],
    isPending,
  } = usePostCommentsNonSuspenseQuery(postId, isOpen);
  const { mutate: likeComment } = useLikeCommentMutation();
  const { mutate: unlikeComment } = useUnlikeCommentMutation();

  const handleFooterLayout = useCallback((event: LayoutChangeEvent) => {
    setFooterHeight(event.nativeEvent.layout.height);
  }, []);

  const footerComponent = useCallback(
    (props: BottomSheetFooterProps) => (
      <BottomSheetFooter {...props}>
        <CommentInputBar
          postId={postId}
          replyTarget={replyTarget}
          onClearReply={() => setReplyTarget(null)}
          InputComponent={BottomSheetTextInput}
          inputRef={inputRef}
          onLayout={handleFooterLayout}
        />
      </BottomSheetFooter>
    ),
    [handleFooterLayout, postId, replyTarget],
  );

  useEffect(() => {
    if (!replyTarget) return;

    const frameId = requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

    return () => cancelAnimationFrame(frameId);
  }, [replyTarget]);

  const handleChange = useCallback((index: number) => {
    setIsOpen(index >= 0);
  }, []);

  const handleDismiss = useCallback(() => {
    setIsOpen(false);
    setReplyTarget(null);
  }, []);

  const handleToggleLike = useCallback(
    (comment: Comment) => {
      if (comment.isLikedByMe) {
        unlikeComment({ postId, commentId: comment.id });
      } else {
        likeComment({ postId, commentId: comment.id });
      }
    },
    [likeComment, postId, unlikeComment],
  );

  const renderComment = useCallback(
    ({ item }: { item: Comment }) => (
      <CommentItem
        comment={item}
        onReply={(target) => setReplyTarget(target)}
        onToggleLike={handleToggleLike}
      />
    ),
    [handleToggleLike],
  );

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

    return (
      <View className="items-center justify-center py-20">
        <Text className="typo-body2 text-semantic-text-secondary text-center">
          {"아직 댓글이 없어요!\n첫 댓글을 남겨볼까요?"}
        </Text>
      </View>
    );
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
        keyboardShouldPersistTaps="always"
      />
    </BaseBottomSheet>
  );
};

export default CommentSheet;
