declare module "*.svg" {
  import React from "react";
  import { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
  export default content;
}

declare module "*.png" {
  const value: import("react-native").ImageSourcePropType;
  export default value;
}

// React Native's FormData accepts file-like objects in addition to standard Blob/string
interface ReactNativeFileObject {
  uri: string;
  type: string;
  name: string;
}

interface FormData {
  append(name: string, value: ReactNativeFileObject): void;
}
