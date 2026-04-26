import ChevronRightIcon from "@/assets/icons/chevron-right.svg";
import SettingsIcon from "@/assets/icons/settings.svg";
import CatList from "@/components/cat/cat-list";
import CatRegistration from "@/components/cat/cat-registration";
import IconHeader from "@/components/layout/icon-header";
import ProfileActions from "@/components/user/my-profile-actions";
import { ProfileInfo } from "@/components/user/profile-info";
import { VIEW_TYPE_ORDER, ViewType } from "@/constants/tab";
import { dark, light } from "@/styles/semantic-colors";
import { Link, Stack } from "expo-router";
import { useRef, useState } from "react";
import { Text, useColorScheme, useWindowDimensions, View } from "react-native";
import { Pressable, ScrollView } from "react-native-gesture-handler";
import PagerView from "react-native-pager-view";

const MyCatListSection = () => {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? dark : light;
  return (
    <>
      <View className="w-full flex-row justify-between items-center px-5 mb-3">
        <Text className="text-semantic-text-secondary typo-body3">
          함께 사는 고양이
        </Text>
        <Link href={`/cat/list`} asChild>
          <Pressable className="active:opacity-60">
            <ChevronRightIcon
              width={16}
              height={16}
              color={colors.icon.secondary}
            />
          </Pressable>
        </Link>
      </View>
      <View className="flex-row items-center pr-5">
        <View className="flex-1">
          <CatList />
        </View>
        <CatRegistration />
      </View>
    </>
  );
};

export default function Mypage() {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? dark : light;

  const pagerRef = useRef<PagerView>(null);
  const [activeTab, setActiveTab] = useState<ViewType>("all");

  const { width } = useWindowDimensions();
  const ITEM_SIZE = width / 3;

  const mockPosts = [
    { id: "1", title: "내가 쓴 글 1" },
    { id: "2", title: "내가 쓴 글 2" },
    { id: "3", title: "내가 쓴 글 3" },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerShadowVisible: false,
          title: "마이페이지",
          headerTintColor: colors.text.primary,
          headerStyle: { backgroundColor: colors.bg.primary },
          headerRight: () => (
            <Link href="/settings" asChild>
              <Pressable className="active:opacity-60">
                <SettingsIcon
                  width={44}
                  height={44}
                  color={colors.icon.primary}
                />
              </Pressable>
            </Link>
          ),
        }}
      />

      <ScrollView className="flex-1 bg-semantic-bg-primary py-6">
        <ProfileInfo />
        <ProfileActions />
        <MyCatListSection />
        <View className="h-6" />
        <IconHeader
          activeTab={activeTab}
          onTabChange={(tab) =>
            pagerRef.current?.setPage(VIEW_TYPE_ORDER.indexOf(tab))
          }
        />
        <PagerView
          ref={pagerRef}
          style={{ flex: 1 }}
          initialPage={0}
          onPageSelected={(e) =>
            setActiveTab(VIEW_TYPE_ORDER[e.nativeEvent.position])
          }
        ></PagerView>
      </ScrollView>
    </>
  );
}
