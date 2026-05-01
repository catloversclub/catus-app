export const ROUTES = {
  AUTH: {
    INDEX: "/(auth)" as const,
    ONBOARDING: {
      INDEX: "/(auth)/(onboarding)" as const,
      STEP1: "/(auth)/(onboarding)/step1" as const,
      STEP2: "/(auth)/(onboarding)/step2" as const,
      STEP3: "/(auth)/(onboarding)/step3" as const,
      STEP4: "/(auth)/(onboarding)/step4" as const,
      STEP5: "/(auth)/(onboarding)/step5" as const,
      STEP6: "/(auth)/(onboarding)/step6" as const,
      STEP7: "/(auth)/(onboarding)/step7" as const,
      STEP8: "/(auth)/(onboarding)/step8" as const,
    },
  },
  TABS: {
    INDEX: "/(tabs)" as const,
    EXPLORE: "/(tabs)/explore" as const,
    CAMERA: "/(tabs)/camera" as const,
    MYPAGE: "/(tabs)/mypage" as const,
    NOTIFICATIONS: "/(tabs)/notifications" as const,
  },
  CAT: {
    LIST: "/cat/list" as const,
    DETAIL: (id: string) => `/cat/${id}` as const,
    REGISTER: "/cat/register" as const,
    UPDATE: (id: string) => `/cat/update/${id}` as const,
  },
  MYPAGE: {
    UPDATE: "/mypage/update" as const,
    UPDATE_TAG: "/mypage/update/tag" as const,
  },
  POST: {
    DETAIL: (id: string) => `/post/${id}` as const,
    CREATE: "/post/create-post" as const,
    EDIT_LIST: "/post/edit-list" as const,
    EDITOR: "/post/editor" as const,
  },
  SETTINGS: {
    INDEX: "/settings" as const,
    TERMS: "/settings/terms" as const,
    TERMS_OF_SERVICE: "/settings/terms-of-service" as const,
    PRIVACY_POLICY: "/settings/privacy-policy" as const,
    DELETE_ACCOUNT: {
      INDEX: "/settings/delete-account" as const,
      REASON: "/settings/delete-account/reason" as const,
    },
  },
  USER: {
    DETAIL: (id: string) => `/user/${id}` as const,
    FOLLOWER: "/user/follower" as const,
    FOLLOWING: "/user/following" as const,
  },
} as const;
