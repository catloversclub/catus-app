import { useUserProfileQuery } from "@/api/domains/user/queries";
import ProfileImage from "@/components/common/profile-image";
import Select from "@/components/common/select";
import BottomActionBar from "@/components/layout/bottom-action-bar";
import NameField from "@/components/settings/name-field";
import { Link } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

const UpdateNickname = () => {
  const { data: userData } = useUserProfileQuery();
  const [nickname, setNickname] = useState(userData.nickname);
  return <NameField name={nickname} setName={setNickname} />;
};

const UpdateIfLivingWithCat = () => {
  const { data: userData } = useUserProfileQuery();
  const [isLivingWithCat, setIsLivingWithCat] = useState(
    userData.isLivingWithCat,
  );
  return (
    <View className="flex-col gap-1.5">
      <Text className="typo-label1 text-semantic-text-primary">
        사용자 유형
      </Text>
      <Select
        options={[
          { label: "실제 집사", value: true },
          { label: "랜선 집사", value: false },
        ]}
        value={isLivingWithCat}
        onChange={setIsLivingWithCat}
      />
    </View>
  );
};

const UpdateTag = () => {
  const { data: userData } = useUserProfileQuery();
  const selectedTags = [
    ...userData.favoriteAppearances,
    ...userData.favoritePersonalities,
  ];

  return (
    <View className="flex-col gap-3">
      <Text className="typo-label1 text-semantic-text-primary">관심 태그</Text>
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
      <Link href={`/mypage/update/tag`} asChild>
        <Pressable className="active:opacity-60 w-full">
          <View className="border border-semantic-border-primary py-2 justify-center items-center rounded">
            <Text className="typo-body4 text-semantic-text-secondary">
              태그 편집하기
            </Text>
          </View>
        </Pressable>
      </Link>
    </View>
  );
};

const UpdateProfile = () => {
  const { data: userData } = useUserProfileQuery();
  const [canSubmit, setCanSubmit] = useState(false);
  return (
    <View className="flex-1 bg-semantic-bg-primary">
      <ScrollView
        className="py-6 px-3"
        contentContainerStyle={{ flexGrow: 1, alignItems: "center", gap: 40 }}
      >
        <ProfileImage
          imageUrl={userData.profileImageUrl}
          size="lg"
          isEditMode
        />
        <View className="w-full flex-col gap-8">
          <UpdateNickname />
          <UpdateIfLivingWithCat />
          <UpdateTag />
        </View>
      </ScrollView>
      <BottomActionBar
        buttons={[
          {
            label: "저장",
            onPress: () => {},
            disabled: !canSubmit, // state 그대로 전달
          },
        ]}
      />
    </View>
  );
};

export default UpdateProfile;
