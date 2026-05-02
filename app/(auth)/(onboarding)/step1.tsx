import BottomActionBar from "@/components/layout/bottom-action-bar";
import ProgressBar from "@/components/onboarding/progress-bar";
import NameField from "@/components/settings/name-field";
import { ROUTES } from "@/constants/route";
import { useNicknameCheck } from "@/hooks/auth/use-nickname-check";
import { useKeyboardAvoidingView } from "@/hooks/use-keyboard-avoiding-view";
import { useCreateUser } from "@/hooks/user/use-create-user";
import { cn } from "@/lib/utils";
import { router } from "expo-router";
import { KeyboardAvoidingView, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const Step1 = () => {
  const keyboardAvoidingViewProps = useKeyboardAvoidingView();
  const {
    nickname,
    hasChecked,
    isValidNickname,
    isDirty,
    statusText,
    handleChangeNickname,
    confirmCheck,
  } = useNicknameCheck();
  const { submit, isPending } = useCreateUser();

  const handlePressNext = async () => {
    if (hasChecked && isValidNickname && !isDirty) {
      await submit(nickname);
      router.push(ROUTES.AUTH.ONBOARDING.STEP2);
    } else {
      confirmCheck();
    }
  };

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
          setName={handleChangeNickname}
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
            onPress: handlePressNext,
            disabled:
              !nickname.trim() || (hasChecked && !isDirty && !isValidNickname),
            isPending: isPending,
          },
        ]}
      />
    </KeyboardAvoidingView>
  );
};

export default Step1;
