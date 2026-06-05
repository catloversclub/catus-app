import { NotificationSettings } from "@/api/domains/notification/types";
import {
  useNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
} from "@/api/domains/notification/queries";
import Toggle from "@/components/common/toggle";
import SettingsSection from "@/components/settings/settings-section";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const DEFAULT_SETTINGS: NotificationSettings = {
  all: true,
  likes: true,
  comments: true,
  replies: true,
  newFollowers: true,
  marketing: true,
};

const ACTIVITY_ITEMS: {
  key: keyof Pick<NotificationSettings, "likes" | "comments" | "replies">;
  label: string;
}[] = [
  { key: "likes", label: "좋아요" },
  { key: "comments", label: "댓글" },
  { key: "replies", label: "대댓글" },
];

const FOLLOW_ITEMS: {
  key: keyof Pick<NotificationSettings, "newFollowers">;
  label: string;
}[] = [{ key: "newFollowers", label: "새 팔로워" }];

const MARKETING_ITEMS: {
  key: keyof Pick<NotificationSettings, "marketing">;
  label: string;
}[] = [{ key: "marketing", label: "이벤트 및 소식" }];

const CHILD_KEYS: (keyof Omit<NotificationSettings, "all">)[] = [
  "likes",
  "comments",
  "replies",
  "newFollowers",
  "marketing",
];

const NotificationSettingsScreen = () => {
  const { data } = useNotificationSettingsQuery();
  const updateSettings = useUpdateNotificationSettingsMutation();
  const settings = data ?? DEFAULT_SETTINGS;

  const setSettings = (nextSettings: NotificationSettings) => {
    updateSettings.mutate(nextSettings);
  };

  const handleAllChange = (value: boolean) => {
    setSettings({
      all: value,
      likes: value,
      comments: value,
      replies: value,
      newFollowers: value,
      marketing: value,
    });
  };

  const handleItemChange = (
    key: keyof Omit<NotificationSettings, "all">,
    value: boolean,
  ) => {
    const nextSettings = {
      ...settings,
      [key]: value,
    };
    nextSettings.all = CHILD_KEYS.every((childKey) =>
      childKey === key ? value : nextSettings[childKey],
    );
    setSettings(nextSettings);
  };

  return (
    <ScrollView
      className="flex-1 bg-semantic-bg-primary"
      contentContainerClassName="py-6 px-5 gap-7 flex-col"
    >
      <View className="bg-semantic-bg-secondary rounded-lg px-3 py-4 flex-row items-center justify-between">
        <View className="flex-1 pr-4">
          <Text className="typo-body3 text-semantic-text-primary mb-1">
            전체 알림
          </Text>
          <Text className="typo-body4 text-semantic-text-tertiary">
            모든 알림을 켜거나 끌 수 있어요
          </Text>
        </View>
        <Toggle value={settings.all} onValueChange={handleAllChange} />
      </View>

      <SettingsSection title="활동 알림">
        {ACTIVITY_ITEMS.map(({ key, label }) => (
          <View
            key={key}
            className="flex-row justify-between items-center py-4 px-3"
          >
            <Text className="text-semantic-text-primary typo-body3">
              {label}
            </Text>
            <Toggle
              value={settings[key]}
              onValueChange={(value) => handleItemChange(key, value)}
            />
          </View>
        ))}
      </SettingsSection>

      <SettingsSection title="팔로우 알림">
        {FOLLOW_ITEMS.map(({ key, label }) => (
          <View
            key={key}
            className="flex-row justify-between items-center py-4 px-3"
          >
            <Text className="text-semantic-text-primary typo-body3">
              {label}
            </Text>
            <Toggle
              value={settings[key]}
              onValueChange={(value) => handleItemChange(key, value)}
            />
          </View>
        ))}
      </SettingsSection>

      <SettingsSection title="마케팅">
        {MARKETING_ITEMS.map(({ key, label }) => (
          <View
            key={key}
            className="flex-row justify-between items-center py-4 px-3"
          >
            <Text className="text-semantic-text-primary typo-body3">
              {label}
            </Text>
            <Toggle
              value={settings[key]}
              onValueChange={(value) => handleItemChange(key, value)}
            />
          </View>
        ))}
      </SettingsSection>
    </ScrollView>
  );
};

export default NotificationSettingsScreen;
