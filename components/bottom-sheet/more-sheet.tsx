import BanIcon from "@/assets/icons/ban.svg";
import BlockIcon from "@/assets/icons/block.svg";
import ShareIcon from "@/assets/icons/share.svg";
import BaseBottomSheet from "@/components/bottom-sheet/base-bottom-sheet";
import { useBlockUserMutation } from "@/api/domains/user/queries";
import { useReportPostMutation } from "@/api/domains/post/queries";
import { Post } from "@/api/domains/post/types";
import { WEBVIEW_URL } from "@/constants/api";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React from "react";
import { Alert, Pressable, Share, Text, View } from "react-native";
import Toast from "react-native-toast-message";

interface MoreSheetProps {
  MoreSheetModalRef: React.RefObject<BottomSheetModal | null>;
  post: Post;
}

const MoreSheet = ({ MoreSheetModalRef, post }: MoreSheetProps) => {
  const { mutate: reportPost } = useReportPostMutation();
  const { mutate: blockUser } = useBlockUserMutation();

  const dismiss = () => MoreSheetModalRef.current?.dismiss();

  const handleReport = () => {
    Alert.alert("신고하기", "이 게시물을 신고하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "신고",
        style: "destructive",
        onPress: () => {
          reportPost(post.id, {
            onSuccess: () => {
              dismiss();
              Toast.show({ type: "success", text1: "신고가 접수되었습니다." });
            },
            onError: () => {
              Toast.show({ type: "error", text1: "신고에 실패했습니다." });
            },
          });
        },
      },
    ]);
  };

  const handleBlock = () => {
    Alert.alert(
      "차단하기",
      `${post.author.nickname}님을 차단하시겠습니까?`,
      [
        { text: "취소", style: "cancel" },
        {
          text: "차단",
          style: "destructive",
          onPress: () => {
            blockUser(post.author.id, {
              onSuccess: () => {
                dismiss();
                Toast.show({
                  type: "success",
                  text1: `${post.author.nickname}님을 차단했습니다.`,
                });
              },
              onError: () => {
                Toast.show({ type: "error", text1: "차단에 실패했습니다." });
              },
            });
          },
        },
      ],
    );
  };

  const handleShare = async () => {
    await Share.share({
      url: `${WEBVIEW_URL}/share/post/${post.id}`,
      message: `@${post.author.nickname}님의 게시물을 확인해보세요!`,
    });
    dismiss();
  };

  const handleVisitProfile = () => {
    dismiss();
    router.push(`/user/${post.author.id}`);
  };

  const MORE_SHEET_ITEMS = [
    { Icon: BanIcon, label: "신고하기", onPress: handleReport },
    { Icon: BlockIcon, label: "차단하기", onPress: handleBlock },
    { Icon: ShareIcon, label: "공유하기", onPress: handleShare },
    { Icon: null, label: "집사 프로필 방문하기", onPress: handleVisitProfile },
  ];

  return (
    <BaseBottomSheet BaseBottomSheetModalRef={MoreSheetModalRef}>
      <View className="flex-1 flex flex-col items-center justify-center pb-16">
        {MORE_SHEET_ITEMS.map(({ Icon, label, onPress }) => (
          <Pressable
            key={label}
            onPress={onPress}
            className="flex-row gap-1.5 py-[14px] items-center justify-center active:opacity-60"
          >
            {Icon && <Icon height={20} width={20} />}
            <Text className="typo-body1 text-semantic-text-primary">
              {label}
            </Text>
          </Pressable>
        ))}
      </View>
    </BaseBottomSheet>
  );
};

export default MoreSheet;
