import { CatProfile } from "@/api/domains/cat/types";
import RegisterBirthDate from "@/app/cat/form/field/birthday";
import RegisterBreed from "@/app/cat/form/field/breed";
import RegisterGender from "@/app/cat/form/field/gender";
import RegisterCatName from "@/app/cat/form/field/name";
import ProfileImage from "@/components/common/profile-image";
import BottomActionBar from "@/components/layout/bottom-action-bar";
import ProgressBar from "@/components/onboarding/progress-bar";
import { useKeyboardAvoidingView } from "@/hooks/use-keyboard-avoiding-view";
import { useCatStore } from "@/store/cat/cat-store";

import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export type CatProfileFormData = Partial<
  Omit<CatProfile, "personalities" | "appearances">
>;

interface CatProfileFormProps {
  initialData?: CatProfileFormData;
  onSubmit: (data: CatProfile) => void;
  onSkip?: () => void;
  isPending: boolean;
  isUpdate?: boolean;
}

const CatProfileForm = ({
  initialData,
  onSubmit,
  onSkip,
  isPending,
  isUpdate = false,
}: CatProfileFormProps) => {
  const { imageUri, setImageUri } = useCatStore();

  const { control, handleSubmit, watch } = useForm<CatProfile>({
    defaultValues: {
      name: initialData?.name ?? "",
      gender: initialData?.gender ?? undefined,
      birthDate: initialData?.birthDate ?? null,
      breed: initialData?.breed ?? null,
    },
  });

  const keyboardAvoidingViewProps = useKeyboardAvoidingView();
  const scrollViewRef = useRef<ScrollView>(null);
  const breedOffsetY = useRef<number>(0);

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-semantic-bg-primary py-6"
      {...keyboardAvoidingViewProps}
    >
      <ProgressBar progress={4} />
      <ScrollView
        className="px-5"
        contentContainerStyle={{ flexGrow: 1 }}
        ref={scrollViewRef}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
      >
        <View className="h-10" />
        <Text className="typo-title2 text-semantic-text-primary w-full">
          고양이의 프로필을 완성해 주세요!
        </Text>
        <Text className="typo-body4 text-semantic-text-tertiary w-full">
          여러 마리의 고양이가 있다면 {"\n"}다음 화면에서 {"\'"}더 추가하기
          {"\'"}를 클릭해주세요.
        </Text>
        <View className="h-6" />
        <View className="items-center">
          <ProfileImage
            imageUrl={imageUri}
            size="lg"
            isEditMode
            handleImageUriChange={(uri) => setImageUri(uri)}
          />
        </View>
        <View className="h-10" />
        <View className="w-full flex-col gap-10 pb-[66px]">
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <RegisterCatName
                name={field.value}
                onChangeName={field.onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="gender"
            render={({ field }) => (
              <RegisterGender
                gender={field.value}
                onChangeGender={field.onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="birthDate"
            render={({ field }) => (
              <RegisterBirthDate
                birthDate={field.value}
                onChangeBirthDate={field.onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="breed"
            render={({ field }) => (
              <RegisterBreed
                breed={field.value}
                onChangeBreed={field.onChange}
                onBreedOpen={() => {
                  setTimeout(() => {
                    scrollViewRef.current?.scrollTo({
                      y: breedOffsetY.current + 4 * 46 + 80,
                      animated: true,
                    });
                  }, 50);
                }}
                onLayout={(y) => {
                  breedOffsetY.current = y;
                }}
              />
            )}
          />
        </View>
        <View className="h-[80px]" />
      </ScrollView>
      <BottomActionBar
        buttons={[
          {
            label: "다음으로",
            onPress: handleSubmit(onSubmit),
            disabled: watch("name") === "" || isPending,
            isPending: isPending,
          },
          ...(onSkip
            ? [
                {
                  label: "건너뛰기",
                  variant: "ghost" as const,
                  onPress: onSkip,
                },
              ]
            : []),
        ]}
      />
    </KeyboardAvoidingView>
  );
};

export default CatProfileForm;
