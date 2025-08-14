import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  CHALLENGES_COLLECTION_ID,
  DATABASE_ID,
  EXPO_PUBLIC_APPWRITE_ENDPOINT,
  EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  PROMPTS_COLLECTION_ID,
  USER_POST_BUCKET_ID,
  USER_POST_COLLECTION_ID,
} from "@/config/Config";
import { databases } from "@/lib/appwrite";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { Query } from "react-native-appwrite";
import { SafeAreaView } from "react-native-safe-area-context";

const screenWidth = Dimensions.get("window").width;
const ACCENT = "#C08EFF";

const buildFileUrl = (bucketId: string, fileId: string) =>
  `${EXPO_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${encodeURIComponent(
    bucketId
  )}/files/${encodeURIComponent(fileId)}/view?project=${encodeURIComponent(
    EXPO_PUBLIC_APPWRITE_PROJECT_ID
  )}`;

const parseCsv = (s?: string | null) =>
  typeof s === "string" && s.trim().length
    ? s
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean)
    : [];

type ChallengeLite = { $id: string; name?: string; title?: string };

export default function HomeScreen() {
  const [challenges, setChallenges] = useState<ChallengeLite[]>([]);
  const [prompt, setPrompt] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const res = await databases.listDocuments(
          DATABASE_ID,
          CHALLENGES_COLLECTION_ID
        );
        const items = res.documents.map((d: any) => ({
          $id: d.$id,
          name: d.name,
          title: d.title,
        }));
        setChallenges(items);
      } catch {}
    };

    const fetchPrompt = async () => {
      const now = new Date();
      const startOfToday = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
      );
      const nowISO = now.toISOString();

      try {
        const res = await databases.listDocuments(
          DATABASE_ID,
          PROMPTS_COLLECTION_ID,
          [
            Query.lessThanEqual("date", nowISO),
            Query.greaterThanEqual("date", startOfToday.toISOString()),
            Query.orderDesc("date"),
            Query.limit(1),
          ]
        );

        if (res.documents.length > 0) {
          setPrompt(res.documents[0].text);
        } else {
          const fallbackRes = await databases.listDocuments(
            DATABASE_ID,
            PROMPTS_COLLECTION_ID,
            [
              Query.lessThan("date", startOfToday.toISOString()),
              Query.orderDesc("date"),
              Query.limit(1),
            ]
          );
          setPrompt(
            fallbackRes.documents.length > 0
              ? fallbackRes.documents[0].text
              : "No prompt available yet."
          );
        }
      } catch {
        setPrompt("Error loading prompt.");
      }
    };

    fetchChallenges();
    fetchPrompt();
    fetchPosts();
  }, []);

  const fetchPosts = useCallback(async () => {
    if (!refreshing) setLoadingPosts(true);
    try {
      const res = await databases.listDocuments(
        DATABASE_ID,
        USER_POST_COLLECTION_ID,
        [Query.orderDesc("$createdAt"), Query.limit(30)]
      );

      const withUrls = res.documents.map((doc: any) => {
        const imageUrl =
          doc.imageUrl ||
          (doc.imageId ? buildFileUrl(USER_POST_BUCKET_ID, doc.imageId) : null);
        const favCount = parseCsv(doc.favouritedBy).length;
        return { ...doc, imageUrl, favCount };
      });

      setPosts(withUrls);
    } catch {
      setPosts([]);
    } finally {
      setLoadingPosts(false);
      setRefreshing(false);
    }
  }, [refreshing]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPosts();
  }, [fetchPosts]);

  const postData = useMemo(
    () =>
      posts.map((p) => ({
        id: p.$id,
        title: p.title ?? "Untitled Post",
        imageUrl: p.imageUrl ?? null,
        favCount: p.favCount ?? 0,
      })),
    [posts]
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ThemedView style={styles.container}>
        <View style={styles.titleRow}>
          <Image
            source={require("../../assets/images/InkSpire_logo.png")}
            style={styles.logo}
          />
          <ThemedText
            style={styles.appTitle}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.9}
          >
            InkSpire
          </ThemedText>
        </View>

        <LinearGradient
          colors={["#C08EFF", "#F0A7F5", "#FFCAA7", "#D5E4B5"]}
          start={[0, 0]}
          end={[1, 1]}
          style={styles.brandDivider}
        />

        <View style={styles.leftPanel}>
          <ThemedText style={styles.sectionTitle}>
            Today&apos;s Prompt
          </ThemedText>

          <Pressable
            onPress={() => router.push("../prompt")}
            style={{ borderRadius: 26 }}
          >
            <LinearGradient
              colors={["#C08EFF", "#F0A7F5", "#FFCAA7", "#D5E4B5"]}
              start={[0, 0]}
              end={[1, 1]}
              style={styles.promptWrapper}
            >
              <View style={styles.promptBox}>
                <ThemedText style={styles.promptText}>
                  {prompt ?? "Loading..."}
                </ThemedText>
                <ThemedText style={styles.promptSubText}>
                  Click to see what others have made
                </ThemedText>
              </View>
            </LinearGradient>
          </Pressable>

          <ThemedText style={[styles.sectionTitle, { marginTop: 25 }]}>
            Monthly Challenges
          </ThemedText>

          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={challenges}
            keyExtractor={(item) => item.$id}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => router.push(`../challenge/${item.$id}`)}
              >
                <View style={styles.challengeCard}>
                  <ThemedText
                    style={styles.challengeCardText}
                    numberOfLines={1}
                  >
                    {item.name || item.title || item.$id}
                  </ThemedText>
                </View>
              </Pressable>
            )}
            ListEmptyComponent={
              <ThemedText style={styles.loadingText}>
                Loading challenges...
              </ThemedText>
            }
          />

          <ThemedText style={[styles.sectionTitle, { marginTop: 40 }]}>
            User Posts
          </ThemedText>

          <FlatList
            data={postData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable
                style={styles.postCard}
                onPress={() => router.push(`../post/${item.id}`)}
              >
                {item.imageUrl ? (
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.postImage}
                  />
                ) : (
                  <View style={[styles.postImage, styles.postImageFallback]} />
                )}

                <View style={styles.postRow}>
                  <ThemedText style={styles.postTitle} numberOfLines={1}>
                    {item.title}
                  </ThemedText>

                  <View style={styles.favPill}>
                    <Ionicons
                      name="heart"
                      size={14}
                      color="#FF6B9A"
                      style={{ marginRight: 4 }}
                    />
                    <ThemedText style={styles.favText}>
                      {item.favCount}
                    </ThemedText>
                  </View>
                </View>
              </Pressable>
            )}
            ListEmptyComponent={
              loadingPosts ? (
                <ThemedText style={styles.loadingText}>
                  Loading posts…
                </ThemedText>
              ) : (
                <ThemedText style={styles.loadingText}>
                  No posts yet.
                </ThemedText>
              )
            }
            style={{ maxHeight: 520 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={ACCENT}
              />
            }
          />
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
     flex: 1,
     backgroundColor: "#111111", },
  container: {
    flex: 1,
    backgroundColor: "#111111",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  logo: {
    width: 120,
    height: 120,
    marginRight: 10,
    resizeMode: "contain",
    borderRadius: 45,
  },
  appTitle: {
    color: "#FFE6EC",
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: 0.5,
    lineHeight: 40,
    paddingTop: 2,
  },
  brandDivider: { height: 3, borderRadius: 3, marginBottom: 18 },
  leftPanel: { flex: 1 },
  sectionTitle: {
    color: "#FFE6EC",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    lineHeight: 24,
    textAlign: "center",
  },
  promptWrapper: { borderRadius: 26, padding: 2, marginBottom: 24 },
  promptBox: {
    backgroundColor: "#181818",
    borderRadius: 24,
    paddingVertical: 22,
    paddingHorizontal: 18,
    minHeight: 120,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  promptText: {
    fontSize: 20,
    fontStyle: "italic",
    textAlign: "center",
    color: "#EDEAF8",
  },
  promptSubText: {
    marginTop: 10,
    fontSize: 14,
    color: "#C08EFF",
    textAlign: "center",
  },
  challengeCard: {
    backgroundColor: "#181818",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 28,
    marginRight: 12,
    minWidth: screenWidth * 0.22,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: ACCENT,
  },
  challengeCardText: {
    fontWeight: "800",
    fontSize: 16,
    color: "#FFE6EC",
    paddingBottom: 16,
  },
  postCard: {
    backgroundColor: "#181818",
    borderRadius: 20,
    padding: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#2B2B2B",
  },
  postImage: {
    width: "100%",
    aspectRatio: 1.2,
    borderRadius: 14,
    marginBottom: 10,
    backgroundColor: "#1A1A1A",
  },
  postImageFallback: { borderWidth: 1, borderColor: "#2B2B2B" },
  postRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  postTitle: {
    fontWeight: "800",
    fontSize: 16,
    color: "#FFE6EC",
    flexShrink: 1,
    paddingRight: 8,
  },
  favPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#1F1F1F",
    borderWidth: 1,
    borderColor: "#2B2B2B",
  },
  favText: { color: "#D2CFE6", fontSize: 13, fontWeight: "700" },
  loadingText: { color: ACCENT },
});
