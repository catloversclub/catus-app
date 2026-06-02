import { useSearchAutocompleteQuery } from "@/api/domains/search/queries";
import { AutocompleteProfileItem } from "@/api/domains/search/types";
import { Image } from "expo-image";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

interface ExploreTypingViewProps {
  query: string;
  onPress: (text: string) => void;
}

interface HighlightedTextProps {
  text: string;
  highlight: string;
}

const HighlightedText = ({ text, highlight }: HighlightedTextProps) => {
  const idx = highlight
    ? text.toLowerCase().indexOf(highlight.toLowerCase())
    : -1;

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

interface ProfileRowProps {
  item: AutocompleteProfileItem;
  query: string;
  onPress: (text: string) => void;
}

const ProfileRow = ({ item, query, onPress }: ProfileRowProps) => (
  <TouchableOpacity
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
);

const Divider = () => (
  <View className="h-px mx-7 bg-semantic-border-primary" />
);

const ExploreTypingView = ({ query, onPress }: ExploreTypingViewProps) => {
  const { data, isFetching } = useSearchAutocompleteQuery(
    query,
    query.trim().length > 0,
  );

  const cats = data?.profile.cats ?? [];
  const users = data?.profile.users ?? [];
  const keywords = data?.post.keywords ?? [];

  if (isFetching && !data) {
    return (
      <View className="mx-3 mt-1.5 rounded overflow-hidden bg-semantic-bg-secondary items-center py-6">
        <ActivityIndicator size="small" />
      </View>
    );
  }

  if (!cats.length && !users.length && !keywords.length) return null;

  const sections = [
    cats.length > 0 && (
      <View key="cats" className="p-1.5">
        {cats.map((item) => (
          <ProfileRow
            key={`cat-${item.profileName}`}
            item={item}
            query={query}
            onPress={onPress}
          />
        ))}
      </View>
    ),
    users.length > 0 && (
      <View key="users" className="p-1.5">
        {users.map((item) => (
          <ProfileRow
            key={`user-${item.profileName}`}
            item={item}
            query={query}
            onPress={onPress}
          />
        ))}
      </View>
    ),
    keywords.length > 0 && (
      <View key="keywords" className="p-1.5">
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
    ),
  ].filter(Boolean);

  return (
    <View className="mx-3 mt-1.5 rounded overflow-hidden bg-semantic-bg-secondary">
      {sections.map((section, i) => (
        <View key={i}>
          {i > 0 && <Divider />}
          {section}
        </View>
      ))}
    </View>
  );
};

export default ExploreTypingView;
