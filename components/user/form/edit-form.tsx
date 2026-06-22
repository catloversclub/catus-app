import { Appearance, Personality } from "@/api/domains/attribute/types";
import ActionPressable from "@/components/common/action-pressable";
import Select from "@/components/common/select";
import BottomActionBar from "@/components/layout/bottom-action-bar";
import NameField from "@/components/settings/name-field";
import UserProfileImage from "@/components/user/profile-image";
import { ROUTES } from "@/constants/route";
import { useKeyboardAvoidingView } from "@/hooks/use-keyboard-avoiding-view";
import { Controller, useForm } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

export type UserEditFormData = {
  nickname: string;
  isLivingWithCat: boolean;
  profileImageUrl: string | null;
};

interface UserEditFormProps {
  initialData?: Partial<UserEditFormData> & {
    favoriteAppearances?: Appearance[];
    favoritePersonalities?: Personality[];
  };
  onSubmit: (data: UserEditFormData) => void;
  isPending: boolean;
}

const UserEditForm = ({
  initialData,
  onSubmit,
  isPending,
}: UserEditFormProps) => {
  const { control, handleSubmit, watch } = useForm<UserEditFormData>({
    defaultValues: {
      nickname: initialData?.nickname ?? "",
      isLivingWithCat: initialData?.isLivingWithCat ?? false,
      profileImageUrl: initialData?.profileImageUrl ?? null,
    },
  });

  const { keyboardAvoidingViewProps } = useKeyboardAvoidingView();
  const selectedTags = [
    ...(initialData?.favoriteAppearances ?? []),
    ...(initialData?.favoritePersonalities ?? []),
  ];

  return (
    <View className="flex-1 bg-semantic-bg-primary">
      <KeyboardAvoidingView {...keyboardAvoidingViewProps}>
        <ScrollView
          className="flex-1 px-5"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="items-center">
            <Controller
              control={control}
              name="profileImageUrl"
              render={({ field }) => (
                <UserProfileImage
                  imageUrl={field.value}
                  size="lg"
                  isEditMode
                  handleImageUriChange={field.onChange}
                />
              )}
            />
          </View>
          <View className="h-10" />
          <View className="w-full flex-col gap-10 pb-[66px]">
            <Controller
              control={control}
              name="nickname"
              render={({ field }) => (
                <NameField name={field.value} setName={field.onChange} />
              )}
            />
            <Controller
              control={control}
              name="isLivingWithCat"
              render={({ field }) => (
                <View className="flex-col gap-1.5">
                  <Text className="typo-label1 text-semantic-text-primary">
                    사용자 유형
                  </Text>
                  <Select
                    options={[
                      { label: "실제 집사", value: true },
                      { label: "랜선 집사", value: false },
                    ]}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </View>
              )}
            />
            <View className="flex-col gap-3">
              <Text className="typo-label1 text-semantic-text-primary">
                관심 태그
              </Text>
              <View className="flex-row flex-wrap gap-3">
                {selectedTags.map((tag) => (
                  <Pressable
                    key={tag.id}
                    className="items-center rounded py-1 px-2.5 bg-semantic-chips-primary-bg"
                  >
                    <Text className="typo-body4 text-semantic-chips-primary-text">
                      {tag.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <ActionPressable
                href={ROUTES.MYPAGE.UPDATE_TAG}
                className="w-full"
              >
                <View className="border border-semantic-border-primary py-2 justify-center items-center rounded">
                  <Text className="typo-body4 text-semantic-text-secondary">
                    태그 편집하기
                  </Text>
                </View>
              </ActionPressable>
            </View>
          </View>
          <View className="h-[80px]" />
        </ScrollView>
      </KeyboardAvoidingView>
      <BottomActionBar
        buttons={[
          {
            label: "저장",
            onPress: handleSubmit(onSubmit),
            disabled: watch("nickname").trim() === "" || isPending,
            isPending: isPending,
          },
        ]}
      />
    </View>
  );
};

export default UserEditForm;
