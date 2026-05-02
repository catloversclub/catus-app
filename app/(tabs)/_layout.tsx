import BellIcon from "@/assets/icons/bell.svg";
import CameraIcon from "@/assets/icons/camera.svg";
import ExploreIcon from "@/assets/icons/explore.svg";
import HouseIcon from "@/assets/icons/house.svg";
import PersonIcon from "@/assets/icons/person.svg";
import { HapticTab } from "@/components/haptic-tab";
import { useColors } from "@/hooks/use-colors";
import { useImagePicker } from "@/hooks/use-image-picker"; // 방금 만든 훅 임포트
import { router, Tabs } from "expo-router";
import { TouchableOpacity, View } from "react-native";

type TabScreenConfig = {
  name: string;
  title?: string;
  Icon?: React.ElementType;
  width?: number;
  height?: number;
  isCustom?: boolean;
};

// 2. 배열에 타입 적용
const TAB_SCREENS: TabScreenConfig[] = [
  { name: "index", title: "Home", Icon: HouseIcon, width: 20, height: 20 },
  {
    name: "explore",
    title: "Explore",
    Icon: ExploreIcon,
    width: 20,
    height: 20,
  },
  { name: "camera", isCustom: true },
  {
    name: "notifications",
    title: "Notifications",
    Icon: BellIcon,
    width: 20,
    height: 20,
  },
  {
    name: "mypage",
    title: "My Page",
    Icon: PersonIcon,
    width: 20,
    height: 20,
  },
];

export default function TabsLayout() {
  // 사용하는 곳
  const { pickImages } = useImagePicker();

  const handleCameraPress = async () => {
    const uris = await pickImages({ selectionLimit: 5 });
    if (!uris) return;

    router.push({
      pathname: "/post/edit-list",
      params: { imageUris: JSON.stringify(uris) },
    });
  };
  const { colors } = useColors();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.icon.primary,
        tabBarInactiveTintColor: colors.icon.primary,
        tabBarStyle: {
          height: 80,
          paddingTop: 5,
          backgroundColor: colors.bg.primary,
          borderTopColor: colors.bg.primary,
        },
      }}
    >
      {TAB_SCREENS.map((tab) => {
        if (tab.isCustom) {
          return (
            <Tabs.Screen
              key={tab.name}
              name={tab.name}
              options={{
                tabBarIcon: () => (
                  <View className="h-11 w-20 items-center justify-center rounded-full bg-yellow-300">
                    <CameraIcon width={20} height={20} color={"#18181b"} />
                  </View>
                ),
                tabBarButton: ({ children, style }) => (
                  <TouchableOpacity onPress={handleCameraPress} style={style}>
                    {children}
                  </TouchableOpacity>
                ),
              }}
            />
          );
        }

        // 3. 렌더링할 컴포넌트를 대문자 변수(Icon)에 할당
        const Icon = tab.Icon;

        return (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={{
              title: tab.title,
              tabBarIcon: ({ color }) => {
                // Icon이 존재할 때만 렌더링하도록 예외 처리 (타입스크립트 에러 방지)
                if (!Icon) return null;
                return (
                  <Icon width={tab.width} height={tab.height} color={color} />
                );
              },
            }}
          />
        );
      })}
    </Tabs>
  );
}
