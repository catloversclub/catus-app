import { useDefaultStackScreenOptions } from "@/hooks/use-default-screen-options";
import { Stack } from "expo-router";

const PostLayout = () => {
  const screenOptions = useDefaultStackScreenOptions();
  return (
    <Stack screenOptions={screenOptions} />
  );
};

export default PostLayout;
