import { BaseBottomSheet } from "@/components/bottom-sheet/base-bottom-sheet";
import CommentList from "@/components/feed/CommentList";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React from "react";

interface CommentSheetProps {
  postId: string;
  CommentSheetModalRef: React.RefObject<BottomSheetModal | null>;
}

export const CommentSheet = ({
  CommentSheetModalRef,
  postId,
}: CommentSheetProps) => {
  return (
    <BaseBottomSheet BaseBottomSheetModalRef={CommentSheetModalRef}>
      <CommentList postId={postId} />
    </BaseBottomSheet>
  );
};
