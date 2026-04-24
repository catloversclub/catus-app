import {
  SettingsLinkItem,
  SettingsToggleItem,
} from "@/components/settings/settings-item";
import SettingsSection from "@/components/settings/settings-section";
import { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";

const Follower = () => {
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  return (
    <ScrollView
      className="flex-1 bg-semantic-bg-primary"
      contentContainerClassName="py-6 px-5 gap-7 flex-col"
    >
      <SettingsSection title="일반">
        <SettingsToggleItem
          label="알림"
          value={isNotificationEnabled}
          onValueChange={setIsNotificationEnabled}
        />
        <SettingsLinkItem
          label="디스플레이"
          value="라이트 모드"
          onPress={() => {}}
        />
      </SettingsSection>
      <SettingsSection title="문의">
        <SettingsLinkItem label="FAQ" onPress={() => {}} />
        <SettingsLinkItem label="CatUs에 직접 문의하기" onPress={() => {}} />
      </SettingsSection>
      <SettingsSection title="기타">
        <SettingsLinkItem label="버전 정보" value="1.0.0" hideButton />
        <SettingsLinkItem label="서비스 이용약관" onPress={() => {}} />
        <SettingsLinkItem label="개인정보 처리 방침" onPress={() => {}} />
      </SettingsSection>
      <SettingsSection title="계정">
        <SettingsLinkItem label="로그아웃" onPress={() => {}} hideButton />
        <SettingsLinkItem label="회원탈퇴" onPress={() => {}} hideButton />
      </SettingsSection>
    </ScrollView>
  );
};

export default Follower;
