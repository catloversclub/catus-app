import Checkbox from "@/components/common/checkbox";
import BottomActionBar from "@/components/layout/bottom-action-bar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { router } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function Step0() {
  const [hasAgreed1, setHasAgreed1] = useState(false);
  const [hasAgreed2, setHasAgreed2] = useState(false);
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
            isChecked={hasAgreed1 && hasAgreed2}
            onToggle={() => {
              setHasAgreed1((prev) => !prev);
              setHasAgreed2((prev) => !prev);
            }}
            label={"이용 약관 전체 동의"}
          />
          <View className="h-px w-full bg-semantic-border-primary" />
          <View className="flex-col gap-1.5">
            <Accordion type="multiple" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger className="flex-row justify-between">
                  <Checkbox
                    isChecked={hasAgreed1}
                    onToggle={() => setHasAgreed1((prev) => !prev)}
                    label={"(필수) 서비스 이용 약관"}
                  />
                </AccordionTrigger>
                <AccordionContent>
                  <Text>Yes. It adheres to the WAI-ARIA design pattern.</Text>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>
                  <Checkbox
                    isChecked={hasAgreed2}
                    onToggle={() => setHasAgreed2((prev) => !prev)}
                    label={"(필수) 개인정보 수집 및 이용 동의"}
                  />
                </AccordionTrigger>
                <AccordionContent>
                  <Text>Yes. It adheres to the WAI-ARIA design pattern.</Text>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </View>
        </View>
      </ScrollView>
      <BottomActionBar
        buttons={[
          {
            label: "다음으로",
            onPress: () => router.push("/(auth)/(onboarding)/step1"),
            disabled: !(hasAgreed1 && hasAgreed2),
          },
        ]}
      />
    </View>
  );
}
