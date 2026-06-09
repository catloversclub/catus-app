import { useMyPostsQuery } from "@/api/domains/post/queries";
import { useUserProfileQuery } from "@/api/domains/user/queries";
import MyCatListSection from "@/components/user/mypage/my-cat-list-section";
import ProfileActions from "@/components/user/mypage/my-profile-actions";
import { UserProfileHeader } from "@/components/user/profile/profile-header";
import { View } from "react-native";

const MyProfileHeaderContent = () => {
  const { data: userData } = useUserProfileQuery();
  const { data: myPostsData } = useMyPostsQuery();
  const postCount = myPostsData.pages.flat().length;

  return (
    <>
      <UserProfileHeader
        userId={userData.id}
        imageUrl={userData.profileImageUrl}
        name={userData.nickname}
        subtitle={userData.isLivingWithCat ? "고양이 집사" : "랜선 집사"}
        postsCount={postCount}
        followerCount={userData.followerCount}
        followingCount={userData.followingCount}
        actions={<ProfileActions />}
      />
      <MyCatListSection />
      <View className="h-6" />
    </>
  );
};

export default MyProfileHeaderContent;
