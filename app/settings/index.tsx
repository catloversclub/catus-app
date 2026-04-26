import { logoutUser } from "@/api/domains/auth/api";
import { DisplayModeSheet } from "@/components/bottom-sheet/display-mode-sheet";
import Button from "@/components/common/button";
import CenterModal from "@/components/modal/center-modal";
import {
  SettingsLinkItem,
  SettingsToggleItem,
} from "@/components/settings/settings-item";
import SettingsSection from "@/components/settings/settings-section";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useCallback, useRef, useState } from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const Follower = () => {
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const DisplayModeSheetModalRef = useRef<BottomSheetModal>(null);
  const handleDisplayModePress = useCallback(() => {
    DisplayModeSheetModalRef.current?.present();
  }, []);
  return (
    <>
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
            onPress={handleDisplayModePress}
          />
        </SettingsSection>
        <SettingsSection title="문의">
          <SettingsLinkItem label="FAQ" onPress={() => {}} />
          <SettingsLinkItem label="CatUs에 직접 문의하기" onPress={() => {}} />
        </SettingsSection>
        <SettingsSection title="기타">
          <SettingsLinkItem label="버전 정보" value="1.0.0" hideButton />
          <SettingsLinkItem
            label="서비스 이용약관"
            onPress={() => router.push("/settings/terms-of-service")}
          />
          <SettingsLinkItem
            label="개인정보 처리 방침"
            onPress={() => router.push("/settings/privacy-policy")}
          />
        </SettingsSection>
        <SettingsSection title="계정">
          <SettingsLinkItem
            label="로그아웃"
            onPress={() => setIsLogoutModalVisible(true)}
            hideButton
          />
          <SettingsLinkItem
            label="회원탈퇴"
            onPress={() => router.push("/settings/delete-account")}
            hideButton
          />
        </SettingsSection>
      </ScrollView>
      <DisplayModeSheet DisplayModeSheetModalRef={DisplayModeSheetModalRef} />
      <CenterModal
        visible={isLogoutModalVisible}
        onClose={() => setIsLogoutModalVisible(false)}
      >
        <View className="bg-semantic-bg-primary p-4 flex-col rounded-lg">
          <Text className="typo-body1 text-semantic-text-secondary mb-1.5">
            로그아웃할까요?
          </Text>
          <Text className="typo-body4 text-semantic-text-tertiary mb-5">
            현재 계정에서 로그아웃할까요?
          </Text>
          <View className="flex-row gap-1.5">
            <Button
              button={{
                label: "취소",
                onPress: () => setIsLogoutModalVisible(false),
                variant: "secondary",
                size: "lg",
              }}
            />
            <Button
              button={{
                label: "로그아웃",
                onPress: async () => {
                  const refreshToken =
                    await SecureStore.getItemAsync("refreshToken");
                  if (refreshToken) {
                    await logoutUser(refreshToken);
                    await SecureStore.deleteItemAsync("accessToken");
                    await SecureStore.deleteItemAsync("refreshToken");
                    router.replace("/(auth)/login");
                  }
                  setIsLogoutModalVisible(false);
                },
                variant: "primary",
                size: "lg",
              }}
            />
          </View>
        </View>
      </CenterModal>
    </>
  );
};

export default Follower;
