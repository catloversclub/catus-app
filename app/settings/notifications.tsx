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
  allEnabled: true,
  postLikeEnabled: true,
  commentEnabled: true,
  replyEnabled: true,
  followEnabled: true,
  marketingEnabled: true,
};

const ACTIVITY_ITEMS: {
  key: keyof Pick<
    NotificationSettings,
    "postLikeEnabled" | "commentEnabled" | "replyEnabled"
  >;
  label: string;
}[] = [
  { key: "postLikeEnabled", label: "좋아요" },
  { key: "commentEnabled", label: "댓글" },
  { key: "replyEnabled", label: "대댓글" },
];

const FOLLOW_ITEMS: {
  key: keyof Pick<NotificationSettings, "followEnabled">;
  label: string;
}[] = [{ key: "followEnabled", label: "새 팔로워" }];

const MARKETING_ITEMS: {
  key: keyof Pick<NotificationSettings, "marketingEnabled">;
  label: string;
}[] = [{ key: "marketingEnabled", label: "이벤트 및 소식" }];

const CHILD_KEYS: (keyof Omit<NotificationSettings, "allEnabled">)[] = [
  "postLikeEnabled",
  "commentEnabled",
  "replyEnabled",
  "followEnabled",
  "marketingEnabled",
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
      allEnabled: value,
      postLikeEnabled: value,
      commentEnabled: value,
      replyEnabled: value,
      followEnabled: value,
      marketingEnabled: value,
    });
  };

  const handleItemChange = (
    key: keyof Omit<NotificationSettings, "allEnabled">,
    value: boolean,
  ) => {
    const nextSettings = {
      ...settings,
      [key]: value,
    };
    nextSettings.allEnabled = CHILD_KEYS.every((childKey) =>
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
        <Toggle value={settings.allEnabled} onValueChange={handleAllChange} />
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
