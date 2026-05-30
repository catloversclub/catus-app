import ArrowLeftIcon from "@/assets/icons/arrow-left.svg";
import CameraIcon from "@/assets/icons/camera.svg";
import Button from "@/components/common/button";
import IconButton from "@/components/common/icon-button";
import CenterModal from "@/components/modal/center-modal";
import { useColors } from "@/hooks/use-colors";
import { useDraftStore } from "@/store/post/draft-store";
import * as MediaLibrary from "expo-media-library";
import { Image } from "expo-image";
import { router, Stack } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SCREEN_WIDTH = Dimensions.get("window").width;
// 12px padding × 2 sides + 6px gap × 2 = 36px → cell = (width - 36) / 3
const CELL_SIZE = (SCREEN_WIDTH - 36) / 3;
const MAX_SELECT = 5;

type GalleryItem =
  | { type: "camera" }
  | { type: "photo"; asset: MediaLibrary.Asset };

const CameraCell = ({ size, onPress }: { size: number; onPress: () => void }) => {
  const { colors } = useColors();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: size,
        height: size,
        backgroundColor: colors.bg.secondary,
        alignItems: "center",
        justifyContent: "center",
      }}
      activeOpacity={0.7}
    >
      <CameraIcon width={24} height={24} color={colors.icon.secondary} />
    </TouchableOpacity>
  );
}

const PhotoCell = ({
  asset,
  size,
  selectionIndex,
  onPress,
}: {
  asset: MediaLibrary.Asset;
  size: number;
  selectionIndex: number;
  onPress: () => void;
}) => {
  const isSelected = selectionIndex >= 0;
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ width: size, height: size }}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: asset.uri }}
        style={{ width: size, height: size }}
        contentFit="cover"
      />
      {isSelected && (
        <View
          style={{
            position: "absolute",
            inset: 0,
            borderWidth: 2,
            borderColor: "#FECF16",
          }}
        />
      )}
      <View
        style={{
          position: "absolute",
          top: 6,
          right: 6,
          width: 22,
          height: 22,
          borderRadius: 11,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: isSelected ? "#FECF16" : "rgba(0,0,0,0.35)",
        }}
      >
        {isSelected && (
          <Text
            style={{ fontSize: 11, fontWeight: "600", color: "#1b1b1b" }}
          >
            {selectionIndex + 1}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const GalleryScreen = () => {
  const { colors } = useColors();
  const { bottom } = useSafeAreaInsets();
  const { draft, clearDraft } = useDraftStore();

  const [permission, requestPermission] = MediaLibrary.usePermissions();
  const [assets, setAssets] = useState<MediaLibrary.Asset[]>([]);
  const [endCursor, setEndCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const loadingRef = useRef(false);

  const loadPhotos = useCallback(async (cursor?: string) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    try {
      const result = await MediaLibrary.getAssetsAsync({
        first: 60,
        mediaType: MediaLibrary.MediaType.photo,
        after: cursor,
      });
      setAssets((prev) =>
        cursor ? [...prev, ...result.assets] : result.assets,
      );
      setEndCursor(result.endCursor);
      setHasMore(result.hasNextPage);
    } finally {
      loadingRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (permission?.status === "granted") {
      loadPhotos();
    }
  }, [permission?.status]);

  useEffect(() => {
    if (draft) setShowDraftModal(true);
  }, []);

  const handleLoadDraft = () => {
    if (!draft) return;
    const uris = draft.imageUris;
    clearDraft();
    setShowDraftModal(false);
    router.push({
      pathname: "/post/edit-list",
      params: { imageUris: JSON.stringify(uris) },
    });
  };

  const handleDismissDraft = () => {
    clearDraft();
    setShowDraftModal(false);
  };

  const toggleSelection = (assetId: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(assetId)) return prev.filter((id) => id !== assetId);
      if (prev.length >= MAX_SELECT) return prev;
      return [...prev, assetId];
    });
  };

  const handleCameraPress = async () => {
    const result = await import("expo-image-picker").then((m) =>
      m.launchCameraAsync({ mediaTypes: ["images"], quality: 1 }),
    );
    if (result.canceled) return;
    const uri = result.assets[0]?.uri;
    if (uri) {
      router.push({
        pathname: "/post/editor",
        params: { imageUris: JSON.stringify([uri]) },
      });
    }
  };

  const handleNext = async () => {
    if (selectedIds.length === 0) return;
    const selectedAssets = selectedIds
      .map((id) => assets.find((a) => a.id === id)!)
      .filter(Boolean);
    const infos = await Promise.all(
      selectedAssets.map((a) => MediaLibrary.getAssetInfoAsync(a)),
    );
    const uris = infos
      .map((info) => info.localUri ?? info.uri)
      .filter(Boolean) as string[];
    router.push({
      pathname: "/post/editor",
      params: { imageUris: JSON.stringify(uris) },
    });
  };

  const listData: GalleryItem[] = [
    { type: "camera" },
    ...assets.map((a) => ({ type: "photo" as const, asset: a })),
  ];

  if (permission?.status !== "granted") {
    return (
      <>
        <Stack.Screen
          options={{
            headerShown: true,
            headerShadowVisible: false,
            title: "최근 항목",
            headerTintColor: colors.text.primary,
            headerStyle: { backgroundColor: colors.bg.primary },
            headerLeft: () => (
              <IconButton onPress={() => router.back()} className="p-2">
                <ArrowLeftIcon
                  width={20}
                  height={20}
                  color={colors.icon.primary}
                />
              </IconButton>
            ),
          }}
        />
        <View className="flex-1 items-center justify-center gap-4 bg-semantic-bg-primary px-6">
          <Text className="typo-body1 text-semantic-text-primary text-center">
            사진 접근 권한이 필요해요
          </Text>
          <TouchableOpacity
            onPress={requestPermission}
            className="px-6 py-3 rounded"
            style={{ backgroundColor: "#FECF16" }}
          >
            <Text className="typo-body1" style={{ color: "#1b1b1b" }}>
              권한 허용하기
            </Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerShadowVisible: false,
          title: "최근 항목",
          headerTintColor: colors.text.primary,
          headerStyle: { backgroundColor: colors.bg.primary },
          headerLeft: () => (
            <IconButton onPress={() => router.back()} className="p-2">
              <ArrowLeftIcon
                width={20}
                height={20}
                color={colors.icon.primary}
              />
            </IconButton>
          ),
        }}
      />

      <View className="flex-1 bg-semantic-bg-primary">
        <FlatList
          data={listData}
          numColumns={3}
          keyExtractor={(item) =>
            item.type === "camera" ? "camera" : item.asset.id
          }
          renderItem={({ item }) => {
            if (item.type === "camera") {
              return (
                <CameraCell size={CELL_SIZE} onPress={handleCameraPress} />
              );
            }
            const selectionIndex = selectedIds.indexOf(item.asset.id);
            return (
              <PhotoCell
                asset={item.asset}
                size={CELL_SIZE}
                selectionIndex={selectionIndex}
                onPress={() => toggleSelection(item.asset.id)}
              />
            );
          }}
          columnWrapperStyle={{ gap: 6 }}
          ItemSeparatorComponent={() => <View style={{ height: 6 }} />}
          contentContainerStyle={{ paddingHorizontal: 12 }}
          showsVerticalScrollIndicator={false}
          onEndReached={() => {
            if (hasMore) loadPhotos(endCursor);
          }}
          onEndReachedThreshold={0.4}
        />

        {/* Bottom button */}
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: colors.border.primary,
            paddingTop: 12,
            paddingBottom: Math.max(bottom, 12) + 12,
            paddingHorizontal: 12,
            backgroundColor: colors.bg.primary,
          }}
        >
          <Button
            button={{
              label: "다음으로",
              onPress: handleNext,
              disabled: selectedIds.length === 0,
              size: "lg",
            }}
          />
        </View>
      </View>

      {/* 임시저장 불러오기 Modal */}
      <CenterModal visible={showDraftModal} onClose={handleDismissDraft}>
        <View
          style={{
            backgroundColor: colors.bg.primary,
            borderRadius: 6,
            paddingHorizontal: 16,
            paddingTop: 24,
            paddingBottom: 16,
            gap: 20,
          }}
        >
          <View style={{ gap: 12 }}>
            <View
              style={{
                width: 24,
                height: 24,
                borderWidth: 2,
                borderStyle: "dashed",
                borderColor: colors.icon.secondary,
                borderRadius: 2,
              }}
            />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: colors.text.secondary,
                letterSpacing: -0.32,
                lineHeight: 25.6,
              }}
            >
              임시 저장된 글을 불러올까요?
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 6 }}>
            <Pressable
              onPress={handleDismissDraft}
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: colors.border.primary,
                borderRadius: 4,
                paddingVertical: 12,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: colors.text.tertiary,
                }}
              >
                취소
              </Text>
            </Pressable>
            <Pressable
              onPress={handleLoadDraft}
              style={{
                flex: 1,
                backgroundColor: colors.button.primary.bg,
                borderRadius: 4,
                paddingVertical: 12,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: colors.button.primary.text,
                }}
              >
                불러오기
              </Text>
            </Pressable>
          </View>
        </View>
      </CenterModal>
    </>
  );
}

export default GalleryScreen;
