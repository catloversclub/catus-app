import { useSearchAutocompleteQuery } from "@/api/domains/search/queries";
import { Image } from "expo-image";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

interface ExploreTypingViewProps {
  query: string;
  onPress: (text: string) => void;
}

const HighlightedText = ({
  text,
  highlight,
}: {
  text: string;
  highlight: string;
}) => {
  if (!highlight) {
    return (
      <Text
        className="typo-body4 text-semantic-text-secondary"
        numberOfLines={1}
      >
        {text}
      </Text>
    );
  }
  const idx = text.toLowerCase().indexOf(highlight.toLowerCase());
  if (idx === -1) {
    return (
      <Text
        className="typo-body4 text-semantic-text-secondary"
        numberOfLines={1}
      >
        {text}
      </Text>
    );
  }
  return (
    <Text
      className="typo-body4 text-semantic-text-secondary"
      numberOfLines={1}
    >
      <Text className="text-semantic-text-success">
        {text.slice(idx, idx + highlight.length)}
      </Text>
      {text.slice(idx + highlight.length)}
    </Text>
  );
};

const ExploreTypingView = ({ query, onPress }: ExploreTypingViewProps) => {
  const { data, isFetching } = useSearchAutocompleteQuery(
    query,
    query.trim().length > 0,
  );

  const profileItems = [
    ...(data?.profile.cats ?? []),
    ...(data?.profile.users ?? []),
  ];
  const keywords = data?.post.keywords ?? [];
  const hasProfileItems = profileItems.length > 0;
  const hasKeywords = keywords.length > 0;

  if (isFetching && !data) {
    return (
      <View className="mx-3 mt-1.5 rounded overflow-hidden bg-semantic-bg-secondary items-center py-6">
        <ActivityIndicator size="small" />
      </View>
    );
  }

  if (!hasProfileItems && !hasKeywords) return null;

  return (
    <View className="mx-3 mt-1.5 rounded overflow-hidden bg-semantic-bg-secondary">
      {hasProfileItems && (
        <View className="p-1.5">
          {profileItems.map((item) => (
            <TouchableOpacity
              key={item.profileName}
              onPress={() => onPress(item.profileName)}
              className="flex-row items-center gap-1.5 h-[46px] p-3"
            >
              <View className="size-9 rounded-full bg-semantic-bg-primary overflow-hidden">
                {item.profileImageUrl && (
                  <Image
                    source={{ uri: item.profileImageUrl }}
                    style={{ width: 36, height: 36 }}
                    contentFit="cover"
                  />
                )}
              </View>
              <HighlightedText text={item.profileName} highlight={query} />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {hasProfileItems && hasKeywords && (
        <View className="h-px mx-7 bg-semantic-border-primary" />
      )}

      {hasKeywords && (
        <View className="p-1.5">
          {keywords.map((keyword) => (
            <TouchableOpacity
              key={keyword}
              onPress={() => onPress(keyword)}
              className="flex-row items-center h-[46px] p-3"
            >
              <HighlightedText text={keyword} highlight={query} />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default ExploreTypingView;
