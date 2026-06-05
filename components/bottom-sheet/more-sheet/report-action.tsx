import { useReportPostMutation } from "@/api/domains/post/queries";
import { Post } from "@/api/domains/post/types";
import BanIcon from "@/assets/icons/ban.svg";
import Button from "@/components/common/button";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Toast from "react-native-toast-message";

const REPORT_REASONS = [
  "스팸 또는 광고를 포함한 내용",
  "혐오 발언 또는 차별적인 내용",
  "폭력적 또는 위험한 콘텐츠",
  "성적인 콘텐츠",
  "사기 또는 거짓 정보",
  "기타",
] as const;

interface ReportActionProps {
  post: Post;
  dismiss: () => void;
  expanded: boolean;
  onExpand: () => void;
}

const ReportAction = ({
  post,
  dismiss,
  expanded,
  onExpand,
}: ReportActionProps) => {
  const { mutate: reportPost } = useReportPostMutation();
  const [step, setStep] = useState<"reasons" | "detail">("reasons");
  const [selectedReason, setSelectedReason] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!expanded) {
      setStep("reasons");
      setSelectedReason("");
      setDescription("");
    }
  }, [expanded]);

  if (!expanded) {
    return (
      <Pressable
        onPress={onExpand}
        className="flex-row gap-1.5 py-[14px] items-center justify-center active:opacity-60"
      >
        <BanIcon height={20} width={20} />
        <Text className="typo-body1 text-semantic-text-primary">신고하기</Text>
      </Pressable>
    );
  }

  if (step === "reasons") {
    return (
      <View className="flex-col pb-8">
        <Text className="typo-body1 text-semantic-text-tertiary text-center py-4">
          신고 사유를 선택해주세요
        </Text>
        {REPORT_REASONS.map((reason) => (
          <Pressable
            key={reason}
            onPress={() => {
              setSelectedReason(reason);
              setStep("detail");
            }}
            className="py-[14px] items-center justify-center active:opacity-60"
          >
            <Text className="typo-body1 text-semantic-chips-primary-text">
              {reason}
            </Text>
          </Pressable>
        ))}
      </View>
    );
  }

  const handleSubmit = () => {
    reportPost(
      {
        postId: post.id,
        reason: selectedReason,
        description: description || undefined,
      },
      {
        onSuccess: () => {
          dismiss();
          Toast.show({ type: "success", text1: "신고가 접수 되었어요" });
        },
        onError: () => {
          Toast.show({ type: "error", text1: "다시 시도해주세요" });
        },
      },
    );
  };

  return (
    <View className="flex-col px-5 pb-8">
      <Text className="typo-body1 text-semantic-chips-primary-text text-center pt-4 mb-2">
        {selectedReason}
      </Text>
      <Text className="typo-label1 text-semantic-text-tertiary text-center mb-4">
        신고 사유에 대해 자세히 설명해주시면 더 빠르게 검토할 수 있어요
      </Text>
      <BottomSheetTextInput
        value={description}
        onChangeText={(text) => setDescription(text.slice(0, 300))}
        multiline
        className="bg-semantic-border-primary min-h-[213px] rounded-lg p-3 text-semantic-text-primary typo-body4"
      />
      <Text className="typo-caption1 text-semantic-text-tertiary text-right mb-4">
        {description.length}/300
      </Text>
      <Button
        button={{
          label: "신고하기",
          onPress: handleSubmit,
          variant: "secondary",
          size: "lg",
        }}
      />
    </View>
  );
};

export default ReportAction;
