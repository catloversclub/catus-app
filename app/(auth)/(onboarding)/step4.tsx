import SelectBreed from "@/components/cat/select-breed";
import Select from "@/components/common/select";
import SelectDate from "@/components/common/select-date";
import BottomActionBar from "@/components/layout/bottom-action-bar";
import ProgressBar from "@/components/onboarding/progress-bar";
import NameField from "@/components/settings/name-field";
import ProfileImage from "@/components/user/profile-image";
import { ROUTES } from "@/constants/route";
import { useCreateCat } from "@/hooks/cat/use-create-cat";
import { useUpdateCat } from "@/hooks/cat/use-update-cat";
import { useKeyboardAvoidingView } from "@/hooks/use-keyboard-avoiding-view";
import { formatDate } from "@/lib/utils";
import { Gender, useOnboardingStore } from "@/store/auth/onboarding-store";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { KeyboardAvoidingView, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const Step4 = () => {
  const { cat } = useOnboardingStore();
  const keyboardAvoidingViewProps = useKeyboardAvoidingView();
  const scrollViewRef = useRef<ScrollView>(null);
  const breedOffsetY = useRef<number>(0);

  const [imageUri, setImageUri] = useState<string | null>(null);
  const { submit: createCat, isPending: isCreating } = useCreateCat();
  const { submitProfileImage, isPending: isUploadingImage } = useUpdateCat();

  const isPending = isCreating || isUploadingImage;

  const handlePressNext = async () => {
    if (!imageUri) return;

    const { id: catId } = await createCat(cat);
    await submitProfileImage(catId, imageUri);
    router.push(ROUTES.AUTH.ONBOARDING.STEP5);
  };

  const handlePressSkip = () => {
    router.push(ROUTES.AUTH.ONBOARDING.STEP3);
  };

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
            handleImageUriChange={setImageUri}
          />
        </View>
        <View className="h-10" />
        <View className="w-full flex-col gap-10 pb-[66px]">
          <RegisterCatName />
          <RegisterGender />
          <RegisterBirthday />
          <RegisterBreed
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
        </View>
        <View className="h-[80px]" />
      </ScrollView>
      <BottomActionBar
        buttons={[
          {
            label: "다음으로",
            onPress: handlePressNext,
            disabled: imageUri === null,
            isPending,
          },
          {
            label: "건너뛰기",
            variant: "ghost",
            onPress: handlePressSkip,
          },
        ]}
      />
    </KeyboardAvoidingView>
  );
};

const RegisterCatName = () => {
  const { setCat } = useOnboardingStore();
  const [catName, setCatName] = useState("");

  const handleCatName = (text: string) => {
    setCatName(text);
    setCat({ name: text });
  };
  return (
    <View className="flex-col">
      <NameField name={catName} setName={handleCatName} />
      <View className="h-1.5" />
      <View className="flex-row justify-end w-full">
        <Text className="typo-label1 text-semantic-text-tertiary">
          {catName.length}/16
        </Text>
      </View>
    </View>
  );
};

const RegisterGender = () => {
  const { setCat } = useOnboardingStore();
  const [gender, setGender] = useState<undefined | Gender>(undefined);

  const handleCatGenderChange = (value: Gender) => {
    setGender(value);
    setCat({ gender: value });
  };
  return (
    <View className="flex-col">
      <Text className="typo-label1 text-semantic-text-primary">성별</Text>
      <View className="h-2" />
      <Select
        options={[
          { label: "여자", value: "FEMALE" },
          { label: "남자", value: "MALE" },
          { label: "선택 안 함", value: null },
        ]}
        value={gender}
        onChange={handleCatGenderChange}
      />
    </View>
  );
};

const RegisterBirthday = () => {
  const { setCat } = useOnboardingStore();
  const [birthday, setBirthday] = useState<null | Date>(null);

  const handleBirthdayChange = (date: Date | null) => {
    setBirthday(date);
    setCat({ birthDate: formatDate(date) });
  };

  return (
    <View className="flex-col">
      <Text className="typo-label1 text-semantic-text-primary">
        생일 (선택)
      </Text>
      <View className="h-2" />
      <SelectDate date={birthday} onChangeDate={handleBirthdayChange} />
    </View>
  );
};

interface RegisterBreedProps {
  onBreedOpen: () => void;
  onLayout: (y: number) => void;
}

const RegisterBreed = ({ onBreedOpen, onLayout }: RegisterBreedProps) => {
  const { setCat } = useOnboardingStore();
  const [breed, setBreed] = useState<null | string>(null);

  const handleBreedChange = (value: string | null) => {
    setBreed(value);
    setCat({ breed: value });
  };
  return (
    <View
      onLayout={(e) => onLayout(e.nativeEvent.layout.y)}
      className="flex-col"
    >
      <Text className="typo-label1 text-semantic-text-primary">
        품종 (선택)
      </Text>
      <View className="h-2" />
      <SelectBreed
        breed={breed}
        onChangeBreed={handleBreedChange}
        onBreedOpen={onBreedOpen}
      />
    </View>
  );
};

export default Step4;
