import ChevronRightIcon from "@/assets/icons/chevron-right.svg";
import Checkbox from "@/components/common/checkbox";
import BottomActionBar from "@/components/layout/bottom-action-bar";
import { ROUTES } from "@/constants/route";
import { useColors } from "@/hooks/use-colors";
import { router } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const TERMS = [
  {
    key: "terms",
    label: "(필수) 서비스 이용 약관",
    route: ROUTES.SETTINGS.TERMS_OF_SERVICE,
  },
  {
    key: "privacy",
    label: "(필수) 개인정보 수집 및 이용 동의",
    route: ROUTES.SETTINGS.PRIVACY_POLICY,
  },
];

export default function Step0() {
  const { colors } = useColors();
  const [agreed, setAgreed] = useState<Record<string, boolean>>(
    Object.fromEntries(TERMS.map(({ key }) => [key, false])),
  );

  const allAgreed = TERMS.every(({ key }) => agreed[key]);

  const toggleAll = () => {
    setAgreed(Object.fromEntries(TERMS.map(({ key }) => [key, !allAgreed])));
  };

  const toggleOne = (key: string) => {
    setAgreed((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <View className="flex-1 bg-semantic-bg-primary">
      <ScrollView
        className="py-10 px-5"
        contentContainerStyle={{ flexGrow: 1, gap: 80 }}
      >
        <Text className="typo-title2 text-semantic-text-primary">
          CatUs 가입을 위해 {"\n"}이용 약관에 동의해주세요
        </Text>
        <View className="flex-col gap-4">
          <Checkbox
            isChecked={allAgreed}
            onToggle={toggleAll}
            label="이용 약관 전체 동의"
          />
          <View className="h-px w-full bg-semantic-border-primary" />
          <View className="flex-col gap-1.5">
            {TERMS.map(({ key, label, route }) => (
              <TouchableOpacity key={key} onPress={() => router.push(route)}>
                <View className="flex-row justify-between py-2">
                  <View className="flex-1">
                    <Checkbox
                      isChecked={agreed[key]}
                      onToggle={() => toggleOne(key)}
                      label={label}
                    />
                  </View>
                  <ChevronRightIcon
                    width={16}
                    height={16}
                    stroke={colors.icon.secondary}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
      <BottomActionBar
        buttons={[
          {
            label: "다음으로",
            onPress: () => router.push(ROUTES.AUTH.ONBOARDING.STEP1),
            disabled: !allAgreed,
          },
        ]}
      />
    </View>
  );
}
