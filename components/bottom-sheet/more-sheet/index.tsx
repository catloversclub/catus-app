import { Post } from "@/api/domains/post/types";
import ShareIcon from "@/assets/icons/share.svg";
import BaseBottomSheet from "@/components/bottom-sheet/base-bottom-sheet";
import ActionPressable from "@/components/common/action-pressable";
import Button from "@/components/common/button";
import { sharePost } from "@/lib/share";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useState } from "react";
import { Text, View } from "react-native";
import BlockAction from "./block-action";
import ReportAction from "./report-action";

interface MoreSheetProps {
  MoreSheetModalRef: React.RefObject<BottomSheetModal | null>;
  post: Post;
}

interface ShareActionProps {
  post: Post;
  dismiss: () => void;
}

interface VisitProfileActionProps {
  authorId: string;
  dismiss: () => void;
}

const ShareAction = ({ post, dismiss }: ShareActionProps) => {
  const handlePress = async () => {
    await sharePost(post.id, post.author.nickname);
    dismiss();
  };

  return (
    <ActionPressable
      onPress={handlePress}
      className="flex-row gap-1.5 py-[14px] items-center justify-center"
    >
      <ShareIcon height={20} width={20} />
      <Text className="typo-body1 text-semantic-text-primary">공유하기</Text>
    </ActionPressable>
  );
};

const VisitProfileAction = ({ authorId, dismiss }: VisitProfileActionProps) => {
  const handlePress = () => {
    dismiss();
    router.push(`/user/${authorId}`);
  };

  return (
    <Button
      button={{
        label: "집사 프로필 방문하기",
        onPress: handlePress,
        variant: "secondary",
        size: "lg",
      }}
    />
  );
};

const MoreSheet = ({ MoreSheetModalRef, post }: MoreSheetProps) => {
  const [reportExpanded, setReportExpanded] = useState(false);

  const dismiss = () => MoreSheetModalRef.current?.dismiss();

  const handleDismiss = () => setReportExpanded(false);

  return (
    <BaseBottomSheet
      BaseBottomSheetModalRef={MoreSheetModalRef}
      onDismiss={handleDismiss}
      keyboardBehavior={reportExpanded ? "interactive" : undefined}
      keyboardBlurBehavior={reportExpanded ? "restore" : undefined}
    >
      {reportExpanded ? (
        <ReportAction
          post={post}
          dismiss={dismiss}
          expanded={true}
          onExpand={() => setReportExpanded(true)}
        />
      ) : (
        <View className="flex-1 flex-col w-full justify-center pb-16 pt-6">
          <ReportAction
            post={post}
            dismiss={dismiss}
            expanded={false}
            onExpand={() => setReportExpanded(true)}
          />
          <BlockAction post={post} dismiss={dismiss} />
          <ShareAction post={post} dismiss={dismiss} />
          <VisitProfileAction authorId={post.author.id} dismiss={dismiss} />
        </View>
      )}
    </BaseBottomSheet>
  );
};

export default MoreSheet;
