import { useCreateCommentMutation } from "@/api/domains/comment/queries";
import ArrowUpIcon from "@/assets/icons/arrow-up.svg";
import ActionPressable from "@/components/common/action-pressable";
import { useColors } from "@/hooks/use-colors";
import { X } from "@/lib/icons";
import React, {
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { LayoutChangeEvent, Text, TextInput, View } from "react-native";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
} from "react-native-reanimated";

export interface CommentInputRef {
  focus: () => void;
  setReplyTarget: (target: ReplyTarget) => void;
  clearReplyTarget: () => void;
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
  const [internalReplyTarget, setInternalReplyTarget] =
    useState<ReplyTarget | null>(null);
  const textInputRef = useRef<TextInput>(null);
  const { progress } = useReanimatedKeyboardAnimation();
  const { mutate: createComment, isPending } = useCreateCommentMutation();

  const isReplyTargetControlled = replyTarget !== undefined;
  const currentReplyTarget = isReplyTargetControlled
    ? replyTarget
    : internalReplyTarget;

  const targetPadding = paddingBottom ?? 24;
  const animatedStyle = useAnimatedStyle(() => ({
    paddingBottom: (1 - progress.value) * targetPadding,
  }));

  const clearReplyTarget = useCallback(() => {
    if (!isReplyTargetControlled) {
      setInternalReplyTarget(null);
    }

    onClearReply?.();
  }, [isReplyTargetControlled, onClearReply]);

  useImperativeHandle(
    inputRef,
    () => ({
      focus: () => {
        textInputRef.current?.focus();
      },
      setReplyTarget: (target: ReplyTarget) => {
        if (!isReplyTargetControlled) {
          setInternalReplyTarget(target);
        }

        requestAnimationFrame(() => {
          textInputRef.current?.focus();
        });
      },
      clearReplyTarget,
    }),
    [clearReplyTarget, isReplyTargetControlled],
  );

  useAnimatedReaction(
    () => progress.value,
    (current, previous) => {
      if (previous !== null && previous > 0.01 && current <= 0.01) {
        runOnJS(clearReplyTarget)();
      }
    },
    [clearReplyTarget],
  );

  const handleSubmit = () => {
    if (!text.trim() || isPending) return;
    createComment(
      {
        postId,
        payload: {
          content: text.trim(),
          parentId: currentReplyTarget?.id ?? null,
        },
      },
      {
        onSuccess: () => {
          setText("");
          clearReplyTarget();
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
            ref={textInputRef}
            value={text}
            onChangeText={setText}
            placeholder={
              currentReplyTarget
                ? `${currentReplyTarget.nickname}에게 답글...`
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
        {currentReplyTarget && (
          <View className="flex-row items-center justify-between mt-1.5">
            <Text className="typo-label1 text-semantic-text-secondary">
              {currentReplyTarget.nickname}님께 답글 남기는 중...
            </Text>
            <ActionPressable onPress={clearReplyTarget} className="p-1">
              <X size={14} className="text-semantic-text-tertiary" />
            </ActionPressable>
          </View>
        )}
      </View>
    </Animated.View>
  );
};

export default CommentInputBar;
