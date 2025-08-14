import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  DATABASE_ID,
  USER_POST_BUCKET_ID,
  USER_POST_COLLECTION_ID,
} from "@/config/Config";
import { account, databases } from "@/lib/appwrite";
import { buildFileUrl, parseIdList, toIdList } from "@/utils/helper"; 
import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ACCENT = "#C08EFF";

export default function PostDetail() {
  // Get the post ID from the route parameters
  const { id } = useLocalSearchParams<{ id: string }>();
  const [me, setMe] = useState<any>(null);
  const [doc, setDoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const user = await account.get().catch(() => null);
        if (!cancelled) setMe(user);

        const d = await databases.getDocument(
          DATABASE_ID,
          USER_POST_COLLECTION_ID,
          id
        );
        const withUrl =
          d.imageUrl || !d.imageId
            ? d
            : { ...d, imageUrl: buildFileUrl(USER_POST_BUCKET_ID, d.imageId) };
        if (!cancelled) setDoc(withUrl);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const favIds = useMemo(
    () => parseIdList(doc?.favouritedBy),
    [doc?.favouritedBy]
  );
  const isFav = me?.$id ? favIds.includes(me.$id) : false;
  const favCount = favIds.length;

  const handleToggleFav = useCallback(async () => {
    if (!me?.$id || !doc?.$id) return;
    setToggling(true);
    try {
      const current = parseIdList(doc.favouritedBy);
      const next = isFav
        ? current.filter((x) => x !== me.$id)
        : [...current, me.$id];
      const updated = toIdList(next);

      const result = await databases.updateDocument(
        DATABASE_ID,
        USER_POST_COLLECTION_ID,
        doc.$id,
        { favouritedBy: updated }
      );

      const withUrl =
        result.imageUrl || !result.imageId
          ? result
          : {
              ...result,
              imageUrl: buildFileUrl(USER_POST_BUCKET_ID, result.imageId),
            };
      setDoc(withUrl);
    } catch {
    } finally {
      setToggling(false);
    }
  }, [me?.$id, doc?.$id, doc?.favouritedBy, isFav]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
        <ThemedView style={styles.center}>
          <ActivityIndicator color={ACCENT} />
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={styles.screen}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={28} color="#EDEAF8" />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.card}>
            <View style={styles.imageWrap}>
              {doc?.imageUrl ? (
                <Image source={{ uri: doc.imageUrl }} style={styles.image} />
              ) : (
                <View style={[styles.image, styles.imageFallback]} />
              )}
            </View>

            <View style={styles.metaRow}>
              <ThemedText style={styles.handle}>
                @{me?.$id === doc?.userID ? me?.name ?? "you" : "creator"}
              </ThemedText>

              <View style={styles.favRow}>
                <ThemedText style={styles.favCount}>{favCount}</ThemedText>
                <Pressable
                  style={[styles.iconBtn, { marginLeft: 8 }]}
                  hitSlop={8}
                  onPress={handleToggleFav}
                  disabled={toggling}
                >
                  <Ionicons
                    name={isFav ? "heart" : "heart-outline"}
                    size={22}
                    color={isFav ? "#FF6B9A" : "#EDEAF8"}
                  />
                </Pressable>
              </View>
            </View>

            {doc?.title ? (
              <ThemedText style={styles.quote} numberOfLines={3}>
                “{doc.title}”
              </ThemedText>
            ) : null}

            {doc?.description ? (
              <ThemedText style={styles.body}>{doc.description}</ThemedText>
            ) : null}
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#111111" },
  screen: { flex: 1, backgroundColor: "#111111" },
  topBar: {
    height: 52,
    paddingHorizontal: 12,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  iconBtn: {
    height: 36,
    width: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  content: { paddingHorizontal: 16, paddingBottom: 24 },
  card: {
    backgroundColor: "#151515",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2B2B2B",
    padding: 12,
  },
  imageWrap: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#1A1A1A",
    marginBottom: 12,
  },
  image: { width: "100%", height: "100%" },
  imageFallback: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#2B2B2B",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  handle: { color: "#EDEAF8", fontWeight: "800", fontSize: 16 },
  favRow: { flexDirection: "row", alignItems: "center" },
  favCount: { color: "#C8BEDF", fontSize: 14 },
  quote: {
    color: "#EDEAF8",
    fontSize: 16,
    fontStyle: "italic",
    marginTop: 8,
    marginBottom: 6,
  },
  body: { color: "#C8BEDF", fontSize: 14, lineHeight: 20 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111111",
  },
});