import { CommentInputRef, ReplyTarget } from "@/components/comment/input-bar";
import { useCallback, useRef, useState } from "react";

const useCommentReplyInput = () => {
  const inputRef = useRef<CommentInputRef>(null);
  const [replyTarget, setReplyTarget] = useState<ReplyTarget | null>(null);

  const clearReplyTarget = useCallback(() => {
    setReplyTarget(null);
  }, []);

  const handleReply = useCallback((target: ReplyTarget) => {
    setReplyTarget(target);

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }, []);

  return {
    inputRef,
    replyTarget,
    handleReply,
    clearReplyTarget,
  };
};

export default useCommentReplyInput;
