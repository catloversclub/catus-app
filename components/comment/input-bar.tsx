import { useCreateCommentMutation } from "@/api/domains/comment/queries";
import ArrowUpIcon from "@/assets/icons/arrow-up.svg";
import ActionPressable from "@/components/common/action-pressable";
import { useColors } from "@/hooks/use-colors";
import { X } from "@/lib/icons";
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Keyboard,
  LayoutChangeEvent,
  Platform,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  onLayout?: (event: LayoutChangeEvent) => void;
}

const CommentInputBar = ({
  postId,
  replyTarget,
  onClearReply,
  InputComponent = TextInput,
  inputRef,
  onLayout,
}: CommentInputBarProps) => {
  const { colors } = useColors();
  const insets = useSafeAreaInsets();
  const [text, setText] = useState("");
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const textInputRef = useRef<TextInput>(null);
  const { mutate: createComment, isPending } = useCreateCommentMutation();
  const currentReplyTarget = replyTarget ?? null;

  const clearReplyTarget = useCallback(() => {
    onClearReply?.();
  }, [onClearReply]);

  useImperativeHandle(
    inputRef,
    () => ({
      focus: () => {
        textInputRef.current?.focus();
      },
    }),
    [],
  );

  useEffect(() => {
    const handleKeyboardShow = () => {
      setIsKeyboardVisible(true);
    };

    const handleKeyboardHide = () => {
      setIsKeyboardVisible(false);
      clearReplyTarget();
    };

    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const subscriptions = [
      Keyboard.addListener(showEvent, handleKeyboardShow),
      Keyboard.addListener(hideEvent, handleKeyboardHide),
    ];

    return () => {
      subscriptions.forEach((subscription) => subscription.remove());
    };
  }, [clearReplyTarget]);

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
          textInputRef.current?.blur();
        },
      },
    );
  };

  const canSubmit = text.trim().length > 0 && !isPending;

  return (
    <View
      className="border-t border-semantic-border-primary bg-semantic-bg-primary"
      onLayout={onLayout}
      style={{ paddingBottom: isKeyboardVisible ? 0 : insets.bottom }}
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
    </View>
  );
};

export default CommentInputBar;
