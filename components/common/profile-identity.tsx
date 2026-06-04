import { Text } from "react-native";

interface ProfileIdentityProps {
  name: string;
  subtitle?: string | null;
}

const ProfileIdentity = ({ name, subtitle }: ProfileIdentityProps) => (
  <>
    <Text className="typo-title3 mb-1 text-semantic-text-primary mt-3">
      {name}
    </Text>
    {subtitle != null && (
      <Text className="typo-body4 mb-3 text-semantic-text-tertiary">
        {subtitle}
      </Text>
    )}
  </>
);

export { ProfileIdentity };
