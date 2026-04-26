import { dark, light } from "@/styles/semantic-colors";
import { Stack } from "expo-router";
import { Text, useColorScheme } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const CatDetailPage = () => {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? dark : light;
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerShadowVisible: false,
          title: "고양이 상세",
          headerTintColor: colors.text.primary,
          headerStyle: { backgroundColor: colors.bg.primary },
        }}
      />

      <ScrollView className="flex-1 bg-semantic-bg-primary py-6 ">
        <Text className="typo-label1 text-semantic-text-secondary">
          고양이 상세페이지
        </Text>
      </ScrollView>
    </>
  );
};

export default CatDetailPage;
