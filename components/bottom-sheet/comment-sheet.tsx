import ArrowUpIcon from "@/assets/icons/arrow-up.svg";
import {
  commentKeys,
  useCreateCommentMutation,
} from "@/api/domains/comment/queries";
import { getPostComments } from "@/api/domains/comment/api";
import BaseBottomSheet from "@/components/bottom-sheet/base-bottom-sheet";
import CommentList from "@/components/feed/comment-list";
import { Text } from "@/components/ui/text";
import { useColors } from "@/hooks/use-colors";
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { useQuery } from "@tanstack/react-query";
import React, { Suspense, useState } from "react";
import { ActivityIndicator, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SNAP_POINTS = ["80%"];

interface CommentSheetProps {
  postId: string;
  CommentSheetModalRef: React.RefObject<BottomSheetModal | null>;
}

const CommentSheet = ({ CommentSheetModalRef, postId }: CommentSheetProps) => {
  const { colors } = useColors();
  const insets = useSafeAreaInsets();
  const [text, setText] = useState("");

  const { data: commentCount } = useQuery({
    queryKey: commentKeys.byPost(postId),
    queryFn: () => getPostComments(postId),
    select: (data) => data.length,
  });

  const { mutate: createComment, isPending } = useCreateCommentMutation();

  const handleSubmit = () => {
    if (!text.trim() || isPending) return;
    createComment(
      { postId, payload: { content: text.trim() } },
      { onSuccess: () => setText("") },
    );
  };

  const canSubmit = text.trim().length > 0 && !isPending;

  return (
    <BaseBottomSheet
      BaseBottomSheetModalRef={CommentSheetModalRef}
      snapPoints={SNAP_POINTS}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
    >
      <View className="items-center border-b border-semantic-border-primary bg-semantic-bg-secondary py-3">
        <Text className="typo-body1 text-semantic-text-primary">
          댓글{commentCount != null ? ` ${commentCount}` : ""}
        </Text>
      </View>

      <BottomSheetScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 8 }}
      >
        <Suspense
          fallback={
            <View className="items-center justify-center py-12">
              <ActivityIndicator />
            </View>
          }
        >
          <CommentList postId={postId} />
        </Suspense>
      </BottomSheetScrollView>

      <View
        className="flex-row items-end gap-2 border-t border-semantic-border-primary bg-semantic-bg-primary px-4 pt-2.5"
        style={{ paddingBottom: insets.bottom + 8 }}
      >
        <View className="min-h-10 flex-1 justify-center rounded-full bg-semantic-bg-secondary px-3.5 py-2.5">
          <BottomSheetTextInput
            value={text}
            onChangeText={setText}
            placeholder="댓글 남기기..."
            placeholderTextColor={colors.text.tertiary}
            multiline
            maxLength={500}
            className="max-h-[100px] p-0 text-[14px] leading-5 text-semantic-text-primary"
            style={{
              includeFontPadding: false,
              textAlignVertical: "center",
            }}
          />
        </View>
        <Pressable
          onPress={handleSubmit}
          disabled={!canSubmit}
          className="h-9 w-9 items-center justify-center rounded-full active:opacity-70"
          style={{ backgroundColor: canSubmit ? colors.icon.accent : colors.icon.minor }}
        >
          <ArrowUpIcon width={20} height={20} color={colors.text.primary} />
        </Pressable>
      </View>
    </BaseBottomSheet>
  );
};

export default CommentSheet;
