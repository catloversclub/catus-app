import { useUserProfileQuery } from "@/api/domains/user/queries";
import Input from "@/components/common/input";
import Select from "@/components/common/select";
import ProfileImage from "@/components/user/profile-image";
import { dark, light } from "@/styles/semantic-colors";
import { Link } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const UpdateProfile = () => {
  const { data: userData } = useUserProfileQuery();

  const [nickname, setNickname] = useState(userData.nickname);
  const [isLivingWithCat, setIsLivingWithCat] = useState(
    userData.isLivingWithCat,
  );
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? dark : light;
  return (
    <SafeAreaView className="flex-1 bg-semantic-bg-primary">
      <ScrollView className="flex-1">
        <ProfileImage
          imageUrl={userData.profileImageUrl}
          size="lg"
          isEditMode
        />
        <View className="w-full flex-col gap-9 px-3">
          <View className="flex-col gap-1.5">
            <Text className="typo-label1 text-semantic-text-primary">이름</Text>
            <Input
              value={nickname}
              onChangeText={setNickname}
              maxLength={16}
              placeholder="이름을 입력하세요."
            />
          </View>
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
          <View className="flex-col gap-1.5">
            <Text className="typo-label1 text-semantic-text-primary">
              관심 태그
            </Text>
            <Link href={`/mypage/update/tag`} asChild>
              <Pressable className="active:opacity-60 flex-1">
                <View className="border border-semantic-border-primary py-2 flex-1 justify-center items-center rounded-sm">
                  <Text className="typo-body4 text-semantic-text-secondary">
                    태그 편집하기
                  </Text>
                </View>
              </Pressable>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UpdateProfile;
