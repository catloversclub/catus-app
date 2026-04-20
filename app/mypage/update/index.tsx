import { useUserProfileQuery } from "@/api/domains/user/queries";
import ProfileImage from "@/components/user/profile-image";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const UpdateProfile = () => {
  const { data: userData } = useUserProfileQuery();
  return (
    <SafeAreaView className="flex-1 bg-semantic-bg-primary">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ProfileImage
          imageUrl={userData.profileImageUrl}
          size="lg"
          isEditMode
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default UpdateProfile;
