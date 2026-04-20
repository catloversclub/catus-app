import SettingsIcon from "@/assets/icons/settings.svg";
import CatList from "@/components/cat/cat-list";
import { Thumbnail } from "@/components/post/thumbnail";
import ProfileActions from "@/components/user/my-profile-actions";
import { ProfileInfo } from "@/components/user/profile-info";
import { dark, light } from "@/styles/semantic-colors";
import { Link, Stack } from "expo-router";
import { Suspense, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";
import { Pressable, ScrollView } from "react-native-gesture-handler";
import PagerView from "react-native-pager-view";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Mypage() {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? dark : light;

  const pagerRef = useRef<PagerView>(null);
  const [activeTab, setActiveTab] = useState(0); // 0: my posts, 1: liked posts, 2: bookmarked posts

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
      <SafeAreaView className="flex-1 bg-semantic-bg-primary">
        <ScrollView className="flex-1">
          <ProfileInfo />
          <ProfileActions />
          <CatList />

          <PagerView
            ref={pagerRef}
            style={{ flex: 1 }}
            initialPage={0}
            onPageSelected={(e) => setActiveTab(e.nativeEvent.position)}
          >
            <Suspense
              fallback={
                <ActivityIndicator size="large" style={{ marginTop: 50 }} />
              }
            >
              <FlatList
                data={mockPosts}
                keyExtractor={(item) => item.id}
                numColumns={3}
                ListHeaderComponent={
                  <>
                    <ProfileInfo />
                    <ProfileActions />
                    <CatList />
                    {/* 탭 헤더 */}
                  </>
                }
                renderItem={({ item }) => (
                  <Thumbnail postId={item.id} size={ITEM_SIZE} />
                )}
              />
            </Suspense>
            <View key="recommended" style={{ flex: 1 }}>
              <Suspense
                fallback={
                  <ActivityIndicator size="large" style={{ marginTop: 50 }} />
                }
              >
                {/* <RecommendedFeedList /> */}
              </Suspense>
            </View>
          </PagerView>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
