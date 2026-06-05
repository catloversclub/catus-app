import { useCreateCommentMutation } from "@/api/domains/comment/queries";
import ArrowUpIcon from "@/assets/icons/arrow-up.svg";
import { useColors } from "@/hooks/use-colors";
import { X } from "@/lib/icons";
import React, { useState } from "react";
import { Pressable, Text, TextInput, TextInputProps, View } from "react-native";

export interface ReplyTarget {
  id: string;
  nickname: string;
}

interface CommentInputBarProps {
  postId: string;
  replyTarget?: ReplyTarget | null;
  onClearReply?: () => void;
  InputComponent?: React.ComponentType<TextInputProps>;
}

const CommentInputBar = ({
  postId,
  replyTarget,
  onClearReply,
  InputComponent = TextInput,
}: CommentInputBarProps) => {
  const { colors } = useColors();
  const [text, setText] = useState("");
  const { mutate: createComment, isPending } = useCreateCommentMutation();

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
    <View className="border-t pb-6 border-semantic-border-primary bg-semantic-bg-primary">
      <View className="flex-row items-end gap-2 px-4 pb-2.5 pt-2.5">
        <View className="min-h-10 flex-1 justify-center rounded bg-semantic-bg-secondary px-3 py-2.5">
          <InputComponent
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
        <Pressable
          onPress={handleSubmit}
          disabled={!canSubmit}
          className="h-9 w-9 items-center justify-center rounded-full active:opacity-70"
          style={{
            backgroundColor: canSubmit ? colors.icon.accent : colors.icon.minor,
          }}
        >
          <ArrowUpIcon width={20} height={20} color={colors.text.primary} />
        </Pressable>
      </View>
      {replyTarget && (
        <View className="flex-row items-center justify-between px-4 py-1.5">
          <Text className="typo-label1 text-semantic-text-secondary">
            @{replyTarget.nickname}에게 답글 남기기
          </Text>
          <Pressable onPress={onClearReply} className="p-1 active:opacity-60">
            <X size={14} className="text-semantic-text-tertiary" />
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default CommentInputBar;
