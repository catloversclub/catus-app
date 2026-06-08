import BottomActionBar from "@/components/layout/bottom-action-bar";
import ProgressBar from "@/components/onboarding/progress-bar";
import NameField from "@/components/settings/name-field";
import { ROUTES } from "@/constants/route";
import { useNicknameCheck } from "@/hooks/auth/use-nickname-check";
import { useKeyboardAvoidingView } from "@/hooks/use-keyboard-avoiding-view";
import { useCreateUser } from "@/hooks/user/use-create-user";
import { useUpdateUser } from "@/hooks/user/use-update-user";
import { cn } from "@/lib/utils";
import { useOnboardingStore } from "@/store/auth/onboarding-store";
import { router } from "expo-router";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

interface Step1FormProps {
  currentNickname?: string;
}

const Step1Form = ({ currentNickname }: Step1FormProps) => {
  const { keyboardAvoidingViewProps } = useKeyboardAvoidingView();
  const isEditMode = !!currentNickname;

  const {
    nickname,
    hasChecked,
    isValidNickname,
    isDirty,
    statusText,
    handleChangeNickname,
    confirmCheck,
  } = useNicknameCheck(currentNickname);

  const { submit: createUser, isPending: isCreating } = useCreateUser();
  const { updateUser, isPending: isUpdating } = useUpdateUser();
  const { setCurrentNickname } = useOnboardingStore();
  const isPending = isCreating || isUpdating;

  const handlePressNext = async () => {
    if (!(hasChecked && isValidNickname && !isDirty)) {
      confirmCheck();
      return;
    }

    if (isEditMode) {
      // 닉네임이 실제로 바뀐 경우에만 업데이트
      if (nickname !== currentNickname) {
        await updateUser({ nickname });
        setCurrentNickname(nickname);
      }
    } else {
      await createUser(nickname);
    }
    router.push(ROUTES.AUTH.ONBOARDING.STEP2);
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

const Step1 = () => {
  // 온보딩 세션 동안만 유지되는 상태로 모드 판단
  // - null: 아직 createUser 안 함 → create 모드
  // - string: 이미 createUser 완료 → edit 모드
  const { currentNickname } = useOnboardingStore();

  // key를 사용해 모드 전환 시 Step1Form을 다시 마운트
  // (useNicknameCheck 내부 useState가 currentNickname으로 다시 초기화되도록)
  return (
    <Step1Form
      key={currentNickname ?? "__create__"}
      currentNickname={currentNickname ?? undefined}
    />
  );
};

export default Step1;
