import { UserProfile } from "@/api/domains/user/types";
import BottomActionBar from "@/components/layout/bottom-action-bar";
import ProgressBar from "@/components/onboarding/progress-bar";
import SelectAppearance from "@/components/tag/select-appearance";
import SelectPersonality from "@/components/tag/select-personality";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export type UserTagFormData = Pick<
  UserProfile,
  "favoriteAppearances" | "favoritePersonalities"
>;

interface UserTagFormProps {
  initialData?: UserTagFormData;
  onSubmit: (data: UserTagFormData) => void;
  onSkip?: () => void;
  isPending: boolean;
  stepNumber?: number;
}

const UserTagForm = ({
  initialData,
  onSubmit,
  onSkip,
  isPending,
  stepNumber,
}: UserTagFormProps) => {
  const { control, handleSubmit, watch } = useForm<UserTagFormData>({
    defaultValues: {
      favoriteAppearances: initialData?.favoriteAppearances ?? [],
      favoritePersonalities: initialData?.favoritePersonalities ?? [],
    },
  });

  const disabled =
    watch("favoriteAppearances").length === 0 &&
    watch("favoritePersonalities").length === 0;

  return (
    <View className="flex-1 bg-semantic-bg-primary pt-6">
      {stepNumber && <ProgressBar progress={stepNumber} />}
      <ScrollView className="px-5" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="h-10" />
        <Text className="typo-title2 text-semantic-text-primary">
          마음이 가는 키워드를 골라주시면{"\n"}맞춤 콘텐츠를 추천해 드릴게요!
        </Text>
        <View className="h-6" />
        <Controller
          control={control}
          name="favoritePersonalities"
          render={({ field }) => (
            <SelectPersonality
              selectedPersonality={new Set(field.value)}
              setSelectedPersonality={(value) =>
                field.onChange(Array.from(value))
              }
            />
          )}
        />
        <View className="h-10" />
        <Controller
          control={control}
          name="favoriteAppearances"
          render={({ field }) => (
            <SelectAppearance
              selectedAppearance={new Set(field.value)}
              setSelectedAppearance={(value) =>
                field.onChange(Array.from(value))
              }
            />
          )}
        />
      </ScrollView>
      <BottomActionBar
        buttons={[
          {
            label: "다음으로",
            onPress: handleSubmit(onSubmit),
            disabled: disabled,
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
    </View>
  );
};

export default UserTagForm;
