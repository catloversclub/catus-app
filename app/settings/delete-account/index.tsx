import AlertLogo from "@/assets/icons/alert.svg";
import BottomActionBar from "@/components/layout/bottom-action-bar";
import { router } from "expo-router";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const DeleteAccount = () => {
  return (
    <View className="flex-1 bg-semantic-bg-primary">
      <ScrollView contentContainerClassName="py-6 px-5 gap-10 flex-col">
        <Text className="typo-title2 text-semantic-text-primary">
          정말 캣어스를 떠나실건가요?
        </Text>
        <View className="flex-col gap-2.5">
          <View className="flex-row gap-1.5 items-center">
            <AlertLogo
              height={16}
              width={16}
              className="fill-semantic-text-error"
            />
            <Text className="typo-title3 text-semantic-text-error">
              탈퇴 전 꼭 확인해주세요!
            </Text>
          </View>
          <Text className="typo-body4 text-semantic-text-tertiary">
            회원 탈퇴 시 계정과 활동 기록이 모두 삭제되며, {"\n"}삭제된 정보는
            복구할 수 없습니다.
          </Text>
        </View>
      </ScrollView>
      <BottomActionBar
        buttons={[
          {
            label: "탈퇴하기",
            onPress: () => router.push("/settings/delete-account/reason"),
          },
          {
            label: "계정 유지하기",
            onPress: () => router.push("/settings"),
            variant: "secondary",
          },
        ]}
      />
    </View>
  );
};

export default DeleteAccount;
