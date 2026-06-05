import BlockIcon from "@/assets/icons/block.svg";
import { useBlockUserMutation } from "@/api/domains/user/queries";
import { Post } from "@/api/domains/post/types";
import Button from "@/components/common/button";
import CenterModal from "@/components/modal/center-modal";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Toast from "react-native-toast-message";

interface BlockActionProps {
  post: Post;
  dismiss: () => void;
}

const BlockAction = ({ post, dismiss }: BlockActionProps) => {
  const { mutate: blockUser } = useBlockUserMutation();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleConfirm = () => {
    blockUser(post.author.id, {
      onSuccess: () => {
        setIsModalVisible(false);
        dismiss();
        Toast.show({
          type: "success",
          text1: `${post.author.nickname}님을 차단했어요`,
        });
      },
      onError: () => {
        Toast.show({ type: "error", text1: "다시 시도해주세요" });
      },
    });
  };

  return (
    <>
      <Pressable
        onPress={() => setIsModalVisible(true)}
        className="flex-row gap-1.5 py-[14px] items-center justify-center active:opacity-60"
      >
        <BlockIcon height={20} width={20} />
        <Text className="typo-body1 text-semantic-text-primary">차단하기</Text>
      </Pressable>

      <CenterModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      >
        <View className="bg-semantic-bg-primary p-4 flex-col rounded-lg">
          <Text className="typo-body1 text-semantic-text-secondary mb-1.5">
            {post.author.nickname}님을 차단할까요?
          </Text>
          <Text className="typo-body4 text-semantic-text-tertiary mb-5">
            해당 사용자의 게시물과 댓글이 더 이상 보이지 않아요
          </Text>
          <View className="flex-row gap-1.5">
            <View className="flex-1">
              <Button
                button={{
                  label: "취소",
                  onPress: () => setIsModalVisible(false),
                  variant: "secondary",
                  size: "lg",
                }}
              />
            </View>
            <View className="flex-1">
              <Button
                button={{
                  label: "차단하기",
                  onPress: handleConfirm,
                  variant: "primary",
                  size: "lg",
                }}
              />
            </View>
          </View>
        </View>
      </CenterModal>
    </>
  );
};

export default BlockAction;
