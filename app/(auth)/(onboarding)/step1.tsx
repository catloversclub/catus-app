import { useCheckNicknameQuery } from "@/api/domains/user/queries";
import BottomActionBar from "@/components/layout/bottom-action-bar";
import ProgressBar from "@/components/onboarding/progress-bar";
import NameField from "@/components/settings/name-field";
import { ROUTES } from "@/constants/route";
import { useKeyboardAvoidingView } from "@/hooks/use-keyboard-avoiding-view";
import { cn } from "@/lib/utils";
import { useOnboardingStore } from "@/store/onboarding-store";
import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function Step1() {
  const keyboardAvoidingViewProps = useKeyboardAvoidingView();

  const { setUser } = useOnboardingStore();

  const [nickname, setNickname] = useState("");
  const [checkedNickname, setCheckedNickname] = useState("");

  const checkNickname = useCheckNicknameQuery(nickname);

  const hasChecked = checkedNickname.length > 0;
  const isValidNickname = checkNickname.data?.available ?? false;
  const isDirty = nickname !== checkedNickname;

  const statusText =
    !hasChecked || isDirty
      ? "중복 여부를 확인해주세요"
      : isValidNickname
        ? "사용할 수 있는 닉네임이에요"
        : "다른 집사가 이미 사용하고 있는 닉네임이에요";

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-semantic-bg-primary py-6"
      {...keyboardAvoidingViewProps}
    >
      <ProgressBar progress={1} />
      <ScrollView className="px-5" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="h-10" />
        <Text className="typo-title2 text-semantic-text-primary">
          닉네임을 입력해주세요
        </Text>
        <View className="h-6" />
        <NameField
          name={nickname}
          setName={(text) => {
            setNickname(text);
            setCheckedNickname("");
          }}
          placeholder="닉네임"
          isError={hasChecked && !isValidNickname}
        />
        <View className="h-1.5" />
        <View className="flex-row justify-end w-full">
          <Text
            className={cn(
              "flex-1 typo-label2",
              hasChecked
                ? isValidNickname
                  ? "text-semantic-text-success"
                  : "text-semantic-text-error"
                : "text-semantic-text-tertiary",
            )}
          >
            {statusText}
          </Text>
          <Text className="typo-label1 text-semantic-text-tertiary">
            {nickname.length}/16
          </Text>
        </View>
      </ScrollView>
      <BottomActionBar
        buttons={[
          {
            label: hasChecked && isValidNickname ? "다음으로" : "중복 확인",
            onPress: () => {
              if (hasChecked && isValidNickname && !isDirty) {
                setUser({ nickname: nickname });
                router.push(ROUTES.AUTH.ONBOARDING.STEP2);
              } else {
                setCheckedNickname(nickname); // 쿼리 트리거
              }
            },
            disabled:
              !nickname.trim() || (hasChecked && !isDirty && !isValidNickname),
          },
        ]}
      />
    </KeyboardAvoidingView>
  );
}
