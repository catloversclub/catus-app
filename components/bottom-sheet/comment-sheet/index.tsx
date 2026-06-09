import {
  usePostCommentsNonSuspenseQuery,
} from "@/api/domains/comment/queries";
import { Comment } from "@/api/domains/comment/types";
import { useUserProfileNonSuspenseQuery } from "@/api/domains/user/queries";
import BaseBottomSheet from "@/components/bottom-sheet/base-bottom-sheet";
import CommentInputBar, { CommentInputRef } from "@/components/comment/input-bar";
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
import useCommentActions from "@/hooks/comment/use-comment-actions";
import React, { useCallback, useRef, useState } from "react";
import { LayoutChangeEvent, View } from "react-native";

interface CommentSheetProps {
  postId: string;
  CommentSheetModalRef: React.RefObject<BottomSheetModal | null>;
}

const CommentSheet = ({ CommentSheetModalRef, postId }: CommentSheetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [footerHeight, setFooterHeight] = useState(0);
  const inputRef = useRef<CommentInputRef>(null);
  const {
    data: comments = [],
    isPending,
  } = usePostCommentsNonSuspenseQuery(postId, isOpen);
  const { data: me } = useUserProfileNonSuspenseQuery();
  const { handleToggleLike } = useCommentActions(postId);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleReplies = useCallback((commentId: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(commentId)) {
        next.delete(commentId);
      } else {
        next.add(commentId);
      }
      return next;
    });
  }, []);

  const handleFooterLayout = useCallback((event: LayoutChangeEvent) => {
    setFooterHeight(event.nativeEvent.layout.height);
  }, []);

  const footerComponent = useCallback(
    (props: BottomSheetFooterProps) => (
      <BottomSheetFooter {...props}>
        <CommentInputBar
          postId={postId}
          InputComponent={BottomSheetTextInput}
          inputRef={inputRef}
          onLayout={handleFooterLayout}
        />
      </BottomSheetFooter>
    ),
    [handleFooterLayout, postId],
  );

  const handleChange = useCallback((index: number) => {
    setIsOpen(index >= 0);
  }, []);

  const handleDismiss = useCallback(() => {
    setIsOpen(false);
    inputRef.current?.clearReplyTarget();
  }, []);

  const renderComment = useCallback(
    ({ item }: { item: Comment }) => (
      <CommentItem
        postId={postId}
        comment={item}
        currentUserId={me?.id}
        isRepliesExpanded={expandedIds.has(item.id)}
        onToggleReplies={() => toggleReplies(item.id)}
        onReply={(target) => inputRef.current?.setReplyTarget(target)}
        onToggleLike={handleToggleLike}
      />
    ),
    [expandedIds, handleToggleLike, me?.id, postId, toggleReplies],
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
