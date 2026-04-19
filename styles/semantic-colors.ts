// styles/semantic-colors.ts
// semantic-colors.css 기반 React Native용 색상 정의

type SemanticColors = {
  bg: { primary: string; secondary: string };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    success: string;
    error: string;
  };
  icon: {
    primary: string;
    secondary: string;
    tertiary: string;
    minor: string;
    accent: string;
    success: string;
    error: string;
  };
  border: {
    primary: string;
    secondary: string;
    disabled: string;
    accent: string;
    error: string;
  };
  button: {
    primary: {
      bg: string;
      text: string;
      pressedBg: string;
      pressedText: string;
      disabledBg: string;
      disabledText: string;
    };
    ghost: { bg: string; text: string; pressedBg: string; pressedText: string };
    outline: {
      bg: string;
      text: string;
      pressedBg: string;
      pressedText: string;
      disabledBg: string;
      disabledText: string;
    };
  };
  chips: {
    primary: {
      bg: string;
      text: string;
      pressedBg: string;
      pressedText: string;
      selectedBg: string;
      selectedText: string;
    };
  };
  dimmed: { primary: string };
};

export const light: SemanticColors = {
  bg: {
    primary: "#ffffff",
    secondary: "#f4f4f5",
  },
  text: {
    primary: "#18181b",
    secondary: "#444444",
    tertiary: "#a1a1aa",
    success: "#0284c7",
    error: "#ef4444",
  },
  icon: {
    primary: "#18181b",
    secondary: "#71717a",
    tertiary: "#a1a1aa",
    minor: "#d4d4d8",
    accent: "#facc15",
    success: "#0284c7",
    error: "#ef4444",
  },
  border: {
    primary: "#e4e4e7",
    secondary: "#f4f4f5",
    disabled: "#f4f4f5",
    accent: "#facc15",
    error: "#ef4444",
  },
  button: {
    primary: {
      bg: "#facc15",
      text: "#18181b",
      pressedBg: "#eab308",
      pressedText: "#18181b",
      disabledBg: "#e4e4e7",
      disabledText: "#a1a1aa",
    },
    ghost: {
      bg: "transparent",
      text: "#52525b",
      pressedBg: "#f4f4f5",
      pressedText: "#18181b",
    },
    outline: {
      bg: "transparent",
      text: "#52525b",
      pressedBg: "#f4f4f5",
      pressedText: "#18181b",
      disabledBg: "transparent",
      disabledText: "#a1a1aa",
    },
  },
  chips: {
    primary: {
      bg: "#f4f4f5",
      text: "#71717a",
      pressedBg: "#e4e4e7",
      pressedText: "#18181b",
      selectedBg: "#facc15",
      selectedText: "#18181b",
    },
  },
  dimmed: {
    primary: "rgba(24, 24, 27, 0.2)",
  },
};

export const dark: SemanticColors = {
  bg: {
    primary: "#18181b",
    secondary: "#27272a",
  },
  text: {
    primary: "#fafafa",
    secondary: "#a1a1aa",
    tertiary: "#52525b",
    success: "#38bdf8",
    error: "#f87171",
  },
  icon: {
    primary: "#fafafa",
    secondary: "#a1a1aa",
    tertiary: "#52525b",
    minor: "#3f3f46",
    accent: "#facc15",
    success: "#38bdf8",
    error: "#f87171",
  },
  border: {
    primary: "#3f3f46",
    secondary: "#27272a",
    disabled: "#52525b",
    accent: "#facc15",
    error: "#f87171",
  },
  button: {
    primary: {
      bg: "#facc15",
      text: "#18181b",
      pressedBg: "#eab308",
      pressedText: "#000000",
      disabledBg: "#3f3f46",
      disabledText: "#71717a",
    },
    ghost: {
      bg: "transparent",
      text: "#a1a1aa",
      pressedBg: "#27272a",
      pressedText: "#fafafa",
    },
    outline: {
      bg: "transparent",
      text: "#a1a1aa",
      pressedBg: "#27272a",
      pressedText: "#fafafa",
      disabledBg: "transparent",
      disabledText: "#71717a",
    },
  },
  chips: {
    primary: {
      bg: "#27272a",
      text: "#a1a1aa",
      pressedBg: "#3f3f46",
      pressedText: "#fafafa",
      selectedBg: "#facc15",
      selectedText: "#18181b",
    },
  },
  dimmed: {
    primary: "rgba(0, 0, 0, 0.5)",
  },
};
