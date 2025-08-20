import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  CHALLENGES_COLLECTION_ID,
  DATABASE_ID,
  USER_POST_BUCKET_ID,
  USER_POST_COLLECTION_ID,
} from "@/config/Config";
import { databases } from "@/lib/appwrite";
import { buildFileUrl, TILE_SIZE } from "@/utils/helper";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { Query } from "react-native-appwrite";
import { SafeAreaView } from "react-native-safe-area-context";

// Define constants for layout
const ACCENT = "#C08EFF";
const GAP = 6;
const COLS = 3;

export default function ChallengeFeed() {
  // Get the challenge ID from the route parameters
  const { id } = useLocalSearchParams<{ id: string }>();
  const [title, setTitle] = useState<string>(id || "Challenge");
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const doc = await databases.getDocument(
          DATABASE_ID,
          CHALLENGES_COLLECTION_ID,
          String(id)
        );
        if (!cancelled)
          setTitle(doc.name || doc.title || doc.$id || "Challenge");

        const res = await databases.listDocuments(
          DATABASE_ID,
          USER_POST_COLLECTION_ID,
          [
            Query.equal("challangeID", String(id)),
            Query.orderDesc("$createdAt"),
            Query.limit(100),
          ]
        );

        // Map documents to include image URLs
        const withUrls = res.documents.map((d: any) =>
          d.imageUrl
            ? d
            : d.imageId
            ? { ...d, imageUrl: buildFileUrl(USER_POST_BUCKET_ID, d.imageId) }
            : d
        );
        if (!cancelled) setPosts(withUrls);
      } catch (e) {
        if (!cancelled) setPosts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // Prepare grid data for FlatList
  const gridData = useMemo(
    () => posts.map((p) => ({ id: p.$id, uri: p.imageUrl || null })),
    [posts]
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={styles.container}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={28} color="#EDEAF8" />
          </Pressable>
          <ThemedText style={styles.title} numberOfLines={1}>
            {title}
          </ThemedText>
          <View style={{ width: 48 }} />
        </View>

        <LinearGradient
          colors={["#C08EFF", "#F0A7F5", "#FFCAA7", "#D5E4B5"]}
          start={[0, 0]}
          end={[1, 1]}
          style={styles.brandDivider}
        />

        {loading ? (
          <View style={styles.loaderWrap}>
            <ActivityIndicator size="large" color={ACCENT} />
          </View>
        ) : (
          <FlatList
            data={gridData}
            keyExtractor={(item) => item.id}
            numColumns={COLS}
            columnWrapperStyle={{ gap: GAP }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 16 }}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => router.replace(`../post/${item.id}`)}
                style={[styles.tile, !item.uri && styles.tileFallback]}
              >
                {item.uri ? (
                  <Image source={{ uri: item.uri }} style={styles.tileImg} />
                ) : (
                  <ThemedText style={styles.tileEmptyText}>No Image</ThemedText>
                )}
              </Pressable>
            )}
            ListEmptyComponent={
              <View style={{ paddingTop: 40, alignItems: "center" }}>
                <ThemedText style={{ color: ACCENT }}>No posts yet.</ThemedText>
              </View>
            }
          />
        )}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#111111",
  },
  container: {
    flex: 1,
    backgroundColor: "#111111",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  backBtn: {
    padding: 8,
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#FFE6EC",
    fontSize: 22,
    fontWeight: "800",
    flex: 1,
    textAlign: "center",
  },
  brandDivider: {
    height: 3,
    borderRadius: 3,
    marginBottom: 12,
  },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#1A1A1A",
    marginBottom: GAP,
    borderWidth: 1,
    borderColor: "#2B2B2B",
  },
  tileImg: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  tileFallback: {
    alignItems: "center",
    justifyContent: "center",
    borderColor: ACCENT,
  },
  tileEmptyText: {
    color: ACCENT,
    fontSize: 12,
  },
  loaderWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
