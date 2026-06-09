import { useCreateCommentMutation } from "@/api/domains/comment/queries";
import ArrowUpIcon from "@/assets/icons/arrow-up.svg";
import ActionPressable from "@/components/common/action-pressable";
import { useColors } from "@/hooks/use-colors";
import { X } from "@/lib/icons";
import React, { useState } from "react";
import { LayoutChangeEvent, Text, TextInput, View } from "react-native";
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
  onLayout?: (event: LayoutChangeEvent) => void;
}

const CommentInputBar = ({
  postId,
  replyTarget,
  onClearReply,
  InputComponent = TextInput,
  inputRef,
  paddingBottom,
  onLayout,
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
      onLayout={onLayout}
      style={animatedStyle}
    >
      <View className="p-3 pb-6">
        <View className="relative min-h-[60px] justify-center rounded bg-semantic-bg-secondary pr-[84px]">
          <InputComponent
            ref={inputRef}
            value={text}
            onChangeText={setText}
            placeholder={
              replyTarget
                ? `${replyTarget.nickname}에게 답글...`
                : "댓글을 작성하세요..."
            }
            placeholderTextColor={colors.text.tertiary}
            multiline
            maxLength={500}
            className="max-h-[100px] text-[14px] leading-5 text-semantic-text-primary"
            style={{
              includeFontPadding: false,
              paddingHorizontal: 12,
              paddingVertical: 10,
              textAlignVertical: "center",
            }}
          />
          <ActionPressable
            onPress={handleSubmit}
            disabled={!canSubmit}
            className="absolute bottom-2.5 right-3 h-10 w-[60px] items-center justify-center rounded-full"
            style={{
              backgroundColor: canSubmit
                ? colors.icon.accent
                : colors.button.primary.disabledBg,
            }}
          >
            <ArrowUpIcon
              width={20}
              height={20}
              color={canSubmit ? colors.icon.primary : colors.icon.tertiary}
            />
          </ActionPressable>
        </View>
        {replyTarget && (
          <View className="flex-row items-center justify-between mt-1.5">
            <Text className="typo-label1 text-semantic-text-secondary">
              {replyTarget.nickname}님께 답글 남기는 중...
            </Text>
            <ActionPressable onPress={onClearReply} className="p-1">
              <X size={14} className="text-semantic-text-tertiary" />
            </ActionPressable>
          </View>
        )}
      </View>
    </Animated.View>
  );
};

export default CommentInputBar;
