import Button, { ButtonType } from "@/components/common/button";

import { View } from "react-native";

interface ProfileActionButtonsProps {
  buttons: ButtonType[];
}

const ProfileActionButtons = ({ buttons }: ProfileActionButtonsProps) => (
  <View className="flex-row gap-1.5 w-full mb-[26px] px-5">
    {buttons.map((button) => (
      <View key={button.label} className="flex-1">
        <Button button={button} />
      </View>
    ))}
  </View>
);

export default ProfileActionButtons;
