import { CatProfile } from "@/api/domains/cat/types";
import RegisterBirthDate from "@/components/cat/form/field/birthday";
import RegisterBreed from "@/components/cat/form/field/breed";
import RegisterGender from "@/components/cat/form/field/gender";
import RegisterCatName from "@/components/cat/form/field/name";
import CatProfileImage from "@/components/cat/profile-image";
import BottomActionBar from "@/components/layout/bottom-action-bar";
import SelectAppearance from "@/components/tag/select-appearance";
import SelectPersonality from "@/components/tag/select-personality";
import { useKeyboardAvoidingView } from "@/hooks/use-keyboard-avoiding-view";
import { useCatStore } from "@/store/cat/cat-store";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

interface CatEditFormProps {
  initialData?: Partial<CatProfile>;
  onSubmit: (data: CatProfile) => void;
  isPending: boolean;
}

const CatEditForm = ({ initialData, onSubmit, isPending }: CatEditFormProps) => {
  const { imageUri, setImageUri } = useCatStore();

  const { control, handleSubmit, watch } = useForm<CatProfile>({
    defaultValues: {
      name: initialData?.name ?? "",
      gender: initialData?.gender ?? undefined,
      birthDate: initialData?.birthDate ?? null,
      breed: initialData?.breed ?? null,
      personalities: initialData?.personalities ?? [],
      appearances: initialData?.appearances ?? [],
    },
  });

  const { keyboardAvoidingViewProps } = useKeyboardAvoidingView();
  const scrollViewRef = useRef<ScrollView>(null);
  const breedOffsetY = useRef<number>(0);

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-semantic-bg-primary py-6"
      {...keyboardAvoidingViewProps}
    >
      <ScrollView
        className="px-5"
        contentContainerStyle={{ flexGrow: 1 }}
        ref={scrollViewRef}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
      >
        <View className="items-center">
          <CatProfileImage
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
        </View>
        <View className="h-[80px]" />
      </ScrollView>
      <BottomActionBar
        buttons={[
          {
            label: "저장",
            onPress: handleSubmit(onSubmit),
            disabled: watch("name") === "" || isPending,
            isPending: isPending,
          },
        ]}
      />
    </KeyboardAvoidingView>
  );
};

export default CatEditForm;
