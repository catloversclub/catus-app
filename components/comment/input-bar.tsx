import { useCreateCommentMutation } from "@/api/domains/comment/queries";
import ArrowUpIcon from "@/assets/icons/arrow-up.svg";
import ActionPressable from "@/components/common/action-pressable";
import { useColors } from "@/hooks/use-colors";
import { X } from "@/lib/icons";
import React, { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

export interface CommentInputRef {
  focus: () => void;
}

export interface ReplyTarget {
  id: string;
  nickname: string;
}

interface CommentInputBarProps {
  postId: string;
  replyTarget?: ReplyTarget | null;
  onClearReply?: () => void;
  InputComponent?: React.ElementType;
  inputRef?: React.Ref<CommentInputRef>;
  paddingBottom?: number;
}

const CommentInputBar = ({
  postId,
  replyTarget,
  onClearReply,
  InputComponent = TextInput,
  inputRef,
  paddingBottom,
}: CommentInputBarProps) => {
  const { colors } = useColors();
  const [text, setText] = useState("");
  const { progress } = useReanimatedKeyboardAnimation();
  const { mutate: createComment, isPending } = useCreateCommentMutation();

  const targetPadding = paddingBottom ?? 24;
  const animatedStyle = useAnimatedStyle(() => ({
    paddingBottom: (1 - progress.value) * targetPadding,
  }));

  const handleSubmit = () => {
    if (!text.trim() || isPending) return;
    createComment(
      {
        postId,
        payload: { content: text.trim(), parentId: replyTarget?.id ?? null },
      },
      {
        onSuccess: () => {
          setText("");
          onClearReply?.();
        },
      },
    );
  };

  const canSubmit = text.trim().length > 0 && !isPending;

  return (
    <Animated.View
      className="border-t border-semantic-border-primary bg-semantic-bg-primary"
      style={animatedStyle}
    >
      <View className="flex-row items-end gap-2 px-4 pb-2.5 pt-2.5">
        <View className="min-h-10 flex-1 justify-center rounded bg-semantic-bg-secondary px-3 py-2.5">
          <InputComponent
            ref={inputRef}
            value={text}
            onChangeText={setText}
            placeholder={
              replyTarget
                ? `@${replyTarget.nickname}에게 답글...`
                : "댓글을 작성하세요..."
            }
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
        <ActionPressable
          onPress={handleSubmit}
          disabled={!canSubmit}
          className="h-9 w-9 items-center justify-center rounded-full"
          style={{
            backgroundColor: canSubmit ? colors.icon.accent : colors.icon.minor,
          }}
        >
          <ArrowUpIcon width={20} height={20} color={colors.text.primary} />
        </ActionPressable>
      </View>
      {replyTarget && (
        <View className="flex-row items-center justify-between px-4 py-1.5">
          <Text className="typo-label1 text-semantic-text-secondary">
            @{replyTarget.nickname}에게 답글 남기기
          </Text>
          <ActionPressable onPress={onClearReply} className="p-1">
            <X size={14} className="text-semantic-text-tertiary" />
          </ActionPressable>
        </View>
      )}
    </Animated.View>
  );
};

export default CommentInputBar;
