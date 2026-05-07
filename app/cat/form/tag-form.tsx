import { CatProfile } from "@/api/domains/cat/types";
import BottomActionBar from "@/components/layout/bottom-action-bar";
import ProgressBar from "@/components/onboarding/progress-bar";
import SelectAppearance from "@/components/tag/select-appearance";
import SelectPersonality from "@/components/tag/select-personality";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export type CatTagFormData = Pick<CatProfile, "personalities" | "appearances">;

interface CatTagFormProps {
  name: string;
  initialData?: CatTagFormData;
  onSubmit: (data: CatProfile) => void;
  onSkip?: () => void;
  isPending: boolean;
}

const CatTagForm = ({
  name,
  initialData,
  onSubmit,
  onSkip,
  isPending,
}: CatTagFormProps) => {
  const { control, handleSubmit, watch } = useForm<CatProfile>({
    defaultValues: {
      personalities: initialData?.personalities ?? [],
      appearances: initialData?.appearances ?? [],
    },
  });

  const disabled =
    watch("appearances").length === 0 && watch("personalities").length === 0;

  return (
    <View className="flex-1 bg-semantic-bg-primary pt-6">
      <ProgressBar progress={5} />
      <ScrollView className="px-5" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="h-10" />
        <Text className="typo-title2 text-semantic-text-primary">
          {name}을/를 더 자세히 설명해주세요!
        </Text>
        <View className="h-6" />
        <Controller
          control={control}
          name="personalities"
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
          name="appearances"
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

export default CatTagForm;
